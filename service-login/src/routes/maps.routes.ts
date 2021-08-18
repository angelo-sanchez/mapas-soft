import { Router } from "express";
import Multer from "multer";
import config from "../config/config";
import { MapsController as maps } from "../controllers/maps.controller";

const router = Router();
const multer = Multer({
    dest: config.workdir + "/input"
});

router.route("/maps")
    .get(maps.getAll)
    .post([multer.single('file')], maps.addMap)
    .delete(maps.deleteMaps);

export default router;