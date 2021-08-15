import { Router } from "express";
import { MapsController as maps } from "../controllers/maps.controller";

const router = Router();

router.route("/maps")
    .get(maps.getAll)
    .post(maps.addMap)
    .put(maps.updateMaps)
    .delete(maps.deleteMaps);

export default router;