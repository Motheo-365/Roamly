import { Router } from "express";

import {
    nearbyLocationsController,
    searchLocationController,
} from "../controllers/locationController.js";

const router = Router();

router.get("/search", searchLocationController);
router.get("/nearby", nearbyLocationsController);

export default router;