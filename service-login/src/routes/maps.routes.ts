import { Router } from "express";
import Multer from "multer";
import passport from "passport";
import config from "../config/config";
import { MapsController as maps } from "../controllers/maps.controller";

const router = Router();
const multer = Multer({
    dest: config.workdir + "/input",
    limits: {
        fileSize: 100*1000*1000
    }
});

router.route("/maps")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.getAll)
    .post([multer.array('file')], maps.addMap)
    .delete(maps.deleteMaps);

export default router;