import { Router } from "express";
import Multer from "multer";
import passport from "passport";
import config from "../config/config";
import { MapsController as maps } from "../controllers/maps.controller";

const router = Router();
const multer = Multer({
    dest: config.workdir + "/input",
    limits: {
        fileSize: config.maxUploadSize * 1000 * 1000
    }
});

router.route("/maps")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.getAll)
    .post([multer.array('file')], maps.addMap)
    .delete(maps.deleteMaps);

router.route("/maps/download/:id")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.download);

router.route("/maps/:id/logs")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.getLogs);

router.route("/maps/:id/preview")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.preview);

router.route("/maps/:id/close")
    .all(passport.authenticate('jwt', { session: false }))
    .get(maps.closePreview);

export default router;