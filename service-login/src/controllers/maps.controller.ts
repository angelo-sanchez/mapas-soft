import { Request, Response } from "express";
import Map from "../models/maps.model";
import { StatusCodes as Status } from "http-status-codes";
import config from "../config/config";
import fs from "fs";

export const MapsController = {
    getAll: function (req: Request, res: Response) {
        Map.find((error, result) => {
            console.error({ error })
            if (error)
                return res.status(Status.INTERNAL_SERVER_ERROR).json(error);
            if (result.length >= 0)
                return res.status(Status.OK).json(result);
            return res.status(Status.NO_CONTENT).json([]);
        })
    },
    deleteMaps: async function (req: Request, res: Response) {
        if (!req.body || !req.body.id || req.body.id.length <= 0)
            return res.status(Status.BAD_REQUEST).json({ message: 'At least one map id must be specified' });

        const ids = req.body.id;
        const maps = await Map.find({ _id: { $in: ids } }).exec();
        if (maps.length <= 0)
            return res.status(Status.NOT_FOUND).json({ message: `No document found with these ids` });
        try {
            let dir = fs.readdirSync(config.workdir, { withFileTypes: true });
            dir.forEach((node) => {
                if (node.isFile()) {
                    let map = maps.find(map => map.name == node.name);
                    if (map) {
                        map.remove();
                        fs.unlinkSync(config.workdir + node.name);
                    }
                }
            });
        } catch (error) {
            res.status(Status.INTERNAL_SERVER_ERROR).json(error);
        }
        return res.status(Status.OK).json({message: 'All the spacified maps were deleted'});
    },
    updateMaps: async function (req: Request, res: Response) { },
    addMap: async function (req: Request, res: Response) { }
}