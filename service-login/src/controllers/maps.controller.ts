import { Request, Response } from "express";
import fs from 'fs';
import { StatusCodes as Status } from "http-status-codes";
import { join, resolve } from 'path';
import config from "../config/config";
import Map from "../models/maps.model";
import { tippecanoe } from "./tippecanoe";

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
                            name: map.name
                        };
                    }));
            return res.status(Status.NO_CONTENT).json([]);
        });
    },
    deleteMaps: async function (req: Request, res: Response) {
        let id: any;
        if (!req.query || !req.query.id || (id = JSON.parse(decodeURIComponent('' + req.query.id))).length <= 0)
            return res.status(Status.BAD_REQUEST).json({ message: 'At least one map id must be specified' });

        const ids = id;
        Map.deleteMany({ _id: { $in: ids } }, (error) => {
            if (error) {
                console.error({ error });
                res.status(Status.INTERNAL_SERVER_ERROR).json({ error });
            }
            return res.status(Status.OK).send();
        });
    },
    addMap: async function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });
        if (!req.files || req.files.length <= 0)
            return res.status(Status.BAD_REQUEST).json({ message: `You didn't attach any GeoJson file` });
        let fileList = req.files as Express.Multer.File[];
        let errors = [];
        let maps = [];
        for (const file of fileList) {
            try {
                let current = await Map.findOne({ name: file.originalname }).exec();
                if (current) {
                    errors.push({ message: `The file ${file.originalname} already exists` });
                    continue;
                }
                let str = fs.readFileSync(file.path).toString();
                if (!str) {
                    errors.push({ message: `The file ${file.originalname} attached is not a valid Json file` });
                    continue;
                }
                let content = JSON.parse(str);
                let map = new Map({
                    owner: (req.user as any).email,
                    createdAt: Date.now(),
                    name: req.body.name || file.originalname,
                    geojson: content
                });
                map = await map.save();
                const output = resolve(join(config.workdir, "output"));
                if (!fs.existsSync(output)) {
                    console.log("Creando: " + output);
                    console.log(fs.mkdirSync(output, {
                        recursive: true
                    }) || "...falló");
                }
                tippecanoe.generateMbtiles(map, file.path, req.body.socketId)
                    .catch(err => console.error("Error al generar", err));
                maps.push({
                    id: map._id,
                    owner: map.owner,
                    date_creation: map.createdAt,
                    name: map.name
                });
            } catch (error) {
                console.error(error);
                console.error(JSON.stringify(error));
                errors.push({ message: `The file ${file.originalname} attached is not a valid Json file` });
            }
        }
        res.status(Status.OK).json({
            errors,
            maps
        });
    }
};