import { Router } from "express";

import activityLogController
    from "../controllers/activityLogController.js";

import { authenticate }
    from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    activityLogController.getActivityLogs
);

export default router;