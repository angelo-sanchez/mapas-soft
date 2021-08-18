import { Request, Response } from "express";
import Map from "../models/maps.model";
import { StatusCodes as Status } from "http-status-codes";

export const MapsController = {
    getAll: function (req: Request, res: Response) {
        Map.find((error, result) => {
            console.error({ error })
            if (error)
                return res.status(Status.INTERNAL_SERVER_ERROR).json(error);
            if (result.length >= 0)
                return res.status(Status.OK)
                    .json(result.map(map => {
                        return {
                            id: map._id,
                            owner: map.owner,
                            date_created: map.createdAt,
                            name: map.name
                        }
                    }));
            return res.status(Status.NO_CONTENT).json([]);
        })
    },
    deleteMaps: async function (req: Request, res: Response) {
        if (!req.body || !req.body.id || req.body.id.length <= 0)
            return res.status(Status.BAD_REQUEST).json({ message: 'At least one map id must be specified' });

        const ids = req.body.id;
        Map.deleteMany({ _id: { $in: ids } }, (error)=>{
            if(error){
                console.error({error});
                res.status(Status.INTERNAL_SERVER_ERROR).json({error});
            }
            return res.status(Status.OK).send();
        });
    },
    addMap: async function (req: Request, res: Response) {
        if (!req.user)
            return res.status(Status.FORBIDDEN).json({ message: 'You must be logged in to make this action' });
        if (!req.file)
            return res.status(Status.BAD_REQUEST).json({ message: `You didn't attach a GeoJson file` });
        try {
            let file = await fetch(req.file.path, {
                method: 'GET'
            })
            if (!(file.ok && file.status == Status.OK)) {
                console.error(`El archivo no se encontró en la ruta ${req.file.path}`);
                return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while uploading file' })
            }
            let content = file.json();
            if (!content)
                return res.status(Status.BAD_REQUEST).json({ message: `The file attached is not a valid Json file` });
            let map = new Map({
                owner: (req.user as any).email,
                createdAt: Date.now(),
                name: req.body.name || req.file.originalname,
                geojson: content
            });
            map = await map.save();
            return res.status(Status.OK).json({
                id: map._id,
                owner: map.owner,
                date_created: map.createdAt,
                name: map.name
            });
        } catch (error) {
            return res.status(Status.BAD_REQUEST).json({ message: `The file attached is not a valid Json file` });
        }
    }
}