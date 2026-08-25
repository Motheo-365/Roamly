import { Router } from "express";
import authController from "../controllers/authControllers.js";

/**
 * Authentication Routes
 *
 * These routes connect HTTP endpoints to the
 * authentication controller.
 *
 * POST /api/auth/register
 * POST /api/auth/login
 */

const router = Router();

/**
 * Register a new user.
 */
router.post(
    "/register",
    authController.register.bind(authController)
);

/**
 * Login an existing user.
 */
router.post(
    "/login",
    authController.login.bind(authController)
);

export default router;