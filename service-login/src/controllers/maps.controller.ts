import { Request, Response } from "express";
import fs from 'fs';
import { StatusCodes as Status } from "http-status-codes";
import { join, resolve } from 'path';
import config from "../config/config";
import Map from "../models/maps.model";
import { tileserver } from "./tileserver";
import { tippecanoe } from "./tippecanoe";

const getName = (name: string) => {
    return name.substring(0, name.lastIndexOf("."));
};

const getExtension = (name: string) => {
    let idx = name.lastIndexOf(".");
    return name.substring(idx + 1);
};

export const MapsController = {
    getAll: function (req: Request, res: Response) {
        Map.find((error, result) => {
            console.error({ error });
            if (error)
                return res.status(Status.INTERNAL_SERVER_ERROR).json(error);
            if (result.length >= 0)
                return res.status(Status.OK)
                    .json(result.map(map => {
                        return {
                            id: map._id,
                            owner: map.owner,
                            date_creation: map.createdAt,
                            name: map.name,
                            ext: map.ext,
                            log: map.log || []
                        };
                    }));
            return res.status(Status.NO_CONTENT).json([]);
        });
    },
    download: function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });

        if (req.params.id) {
            let id = req.params.id;
            let path = resolve(join(config.workdir, 'output', id + '.mbtiles'));
            console.log(path, id);
            if (fs.existsSync(path))
                return res.status(Status.OK).sendFile(path);
            return res.status(Status.NO_CONTENT).send();
        }
    },
    deleteMaps: async function (req: Request, res: Response) {
        let ids: any[] = [];
        let hasQuery = false;
        if (req.query && req.query.id) {
            hasQuery = true;
            try {
                ids = JSON.parse(decodeURIComponent('' + req.query.id));
            } catch (error) {
                return res.status(Status.BAD_REQUEST).json({ message: `Cannot find map id's in ${req.query.id}` });
            }
        }
        if (!hasQuery || ids.length <= 0) {
            return res.status(Status.BAD_REQUEST).json({ message: 'At least one map id must be specified' });
        }

        let error: string[] = [];
        let success: string[] = [];
        for (const id of ids) {
            const map = await Map.findById(id);
            if (!map) {
                error.push(`Map with id: ${id} not found`);
                continue;
            }
            let path = resolve(join(config.workdir, 'output', `${id}.${map.ext}`));
            try {
                map.delete();
            } catch (err) {
                console.error({ error: err });
                error.push(`Map with id: ${id} couldn't be removed, reason: ${err}`);
            }
            success.push(id);
            try {
                fs.rmSync(path);
            } catch (error) {
                console.error({ error });
            }
        }

        if (error.length > 0) {
            console.error({ error });
            return res.status(Status.INTERNAL_SERVER_ERROR).json({ error });
        }

        return res.status(Status.OK).json({ success });
    },
    addMap: async function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });
        if (!req.files || req.files.length <= 0)
            return res.status(Status.BAD_REQUEST).json({ message: `You didn't attach any Json file` });
        let fileList = req.files as Express.Multer.File[];
        let errors = [];
        let maps = [];
        let opciones = JSON.parse(req.body.opciones);
        let procesar = [];
        console.log(opciones);
        for (const file of fileList) {
            let filename = req.body.name || file.originalname;
            try {
                let current = await Map.findOne({ name: filename }).exec();
                if (current) {
                    errors.push({ message: `The file ${filename} already exists`, name: filename });
                    continue;
                }
                let str = fs.readFileSync(file.path).toString();
                if (!str) {
                    errors.push({ message: `The file ${filename} attached is not a valid Json file`, name: filename });
                    continue;
                }
                let content = JSON.parse(str);
                let map = new Map({
                    owner: (req.user as any).email,
                    createdAt: Date.now(),
                    name: getName(filename),
                    ext: getExtension(filename),
                    log: []
                });
                map = await map.save();
                const output = resolve(join(config.workdir, "output"));
                if (!fs.existsSync(output)) {
                    console.log("Creando: " + output);
                    console.log(fs.mkdirSync(output, {
                        recursive: true
                    }) || "...falló");
                }
                let optionsStr = opciones.find((v: any) => v.filename == filename).options;
                procesar.push(() => {
                    tippecanoe.generateMbtiles(map, file.path, optionsStr, req.body.socketId)
                        .catch(err => console.error("Error al generar", err));
                });
                maps.push({
                    id: map._id,
                    owner: map.owner,
                    date_creation: map.createdAt,
                    name: map.name,
                    ext: map.ext,
                    log: []
                });
            } catch (error) {
                console.error(error);
                console.error(JSON.stringify(error));
                errors.push({ message: `The file ${filename} attached is not a valid Json file`, name: filename });
            }
        }
        res.status(Status.OK).json({
            errors,
            maps
        });
        procesar.forEach(v => v());
    },

    preview: async function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });
        if (!req.params.id)
            return res.status(Status.BAD_REQUEST).json({ message: 'Map ID must be provided' });
        const id = req.params.id;
        try {
            const name = await tileserver.start(id);

            return res.status(Status.OK).json({
                id,
                name,
                status: "STARTED",
                url: `${config.tileserver.baseUrl}/data/${id}/`,
            });
        } catch (error) {
            console.error(error);
            return res.status(Status.GATEWAY_TIMEOUT).send(error);
        }
    },

    closePreview: async function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });
        if (!req.params.id)
            return res.status(Status.BAD_REQUEST).json({ message: 'Map ID must be provided' });
        const id = req.params.id;
        const name = await tileserver.stop();

        return res.status(Status.OK).json({ id, name, status: "STOPPED" });
    }
};