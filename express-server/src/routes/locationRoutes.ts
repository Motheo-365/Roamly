import { Router } from "express";

import {
    searchLocationController,
} from "../controllers/locationController.js";

const router = Router();

router.get("/search", searchLocationController);

export default router;