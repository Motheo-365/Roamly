import { Router } from "express";

import imageController from "../controllers/imageController.js";

const router = Router();

/**
 * GET /api/images/:destination
 *
 * Returns a Wikimedia Commons image for a destination.
 */
router.get(
    "/:destination",
    imageController.getDestinationImage.bind(imageController)
);

export default router;