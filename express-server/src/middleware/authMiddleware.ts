import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 *
 * This middleware verifies the JWT sent by the client.
 *
 * Request
 *    ↓
 * Authentication Middleware
 *    ↓
 * Controller
 *
 * If the token is valid, the user's ID is attached
 * to the request.
 *
 * This allows controllers/services to determine which
 * user is making the request.
 */

/**
 * Represents the information stored inside our JWT.
 */
export interface AuthPayload {
    userId: number;
}

/**
 * Extends the Express Request object so that
 * req.userId can be used after authentication.
 */
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

/**
 * Verifies the JWT provided by the client.
 */
export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const authHeader =
            req.headers.authorization;

        /**
         * The expected format is:
         *
         * Authorization: Bearer <token>
         */
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required"
            });
        }

        const [scheme, token] =
            authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token
        ) {
            return res.status(401).json({
                status: "error",
                message: "Invalid authentication format"
            });
        }

        const secret =
            process.env.JWT_SECRET;

        if (!secret) {
            console.error(
                "JWT_SECRET is not configured"
            );

            return res.status(500).json({
                status: "error",
                message: "Authentication configuration error"
            });
        }

        const decoded = jwt.verify(
                token,
                secret
            ) as AuthPayload;

        /**
         * Attach the authenticated user's ID
         * to the request.
         */
        req.userId = decoded.userId;

        next();

    } catch (error) {

        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token"
        });
    }
}