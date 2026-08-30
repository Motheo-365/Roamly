import { Request, Response } from "express";
import authService from "../services/authService.js";

/**
 * Controller Layer
 *
 * AuthController handles HTTP requests related to
 * registration and authentication.
 *
 * The Controller is responsible for:
 * - Reading data from the request
 * - Calling the appropriate Service
 * - Returning an HTTP response
 *
 * Business logic belongs in AuthService, not here.
 *
 * Request
 *    ↓
 * AuthController
 *    ↓
 * AuthService
 *    ↓
 * UserRepository
 *    ↓
 * PostgreSQL
 */
class AuthController {
  /**
   * Registers a new Roamly user.
   *
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await authService.register(email, password);

      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);

      const message =
        error instanceof Error ? error.message : "Failed to register user";

      return res.status(400).json({
        status: "error",
        message,
      });
    }
  }

  /**
   * Logs an existing user into Roamly.
   *
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          id: result.user.id,
          email: result.user.email,
          token: result.token,
        },
      });
    } catch (error) {
      console.error("Error logging in user:", error);

      const message =
        error instanceof Error ? error.message : "Failed to login";

      return res.status(401).json({
        status: "error",
        message,
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      await authService.forgotPassword(email);

      return res.status(200).json({
        status: "success",
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to process password reset request.";

      return res.status(400).json({
        status: "error",
        message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      await authService.resetPassword(token, password);

      return res.status(200).json({
        status: "success",
        message: "Password reset successfully.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);

      const message =
        error instanceof Error ? error.message : "Unable to reset password.";

      return res.status(400).json({
        status: "error",
        message,
      });
    }
  }
}

export default new AuthController();
