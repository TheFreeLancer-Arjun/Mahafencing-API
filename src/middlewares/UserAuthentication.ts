/**
 * @file UserAuthentication.ts
 * @description Middleware to authenticate users using JWT from cookies, headers, or query parameters.
 *              It verifies the token and attaches the decoded user info to the request object.
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config";

/**
 * @function UserAuth
 * @description Express middleware to protect routes by validating a JWT token.
 *              The token can be supplied through cookies, the `Authorization` header, or query parameters.
 *
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next middleware function
 *
 * @returns {void}
 *
 * @example
 * // Use in a route
 * app.get('/dashboard', UserAuth, (req, res) => {
 *   res.send('Protected route');
 * });
 */
export const UserAuth = (req: Request, res: Response, next: NextFunction): void => {
    /**
     * Attempt to retrieve the JWT token from:
     * - cookies: req.cookies.token
     * - authorization header: Bearer <token>
     * - query string: ?token=<token>
     */
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(' ')[1] ||
        req.query.token;

    // If no token is provided, return 401 Unauthorized
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    /**
     * If token is passed via query string, remove it from the URL (security best practice).
     * Redirect to the same path without the token.
     */
    if (req.query.token && req.originalUrl) {
        const cleanUrl = req.originalUrl.replace(/[?&]token=[^&]*/, '');
        if (cleanUrl !== req.originalUrl) {
            res.redirect(cleanUrl);
            return;
        }
    }

    try {
        // Verify token and decode user data
        const decoded = jwt.verify(token, JWT_USER_SECRET) as { id: string; email: string };

        // Attach decoded user to the request object
        (req as any).user = decoded;

        // Pass control to next middleware/handler
        next();
    } catch (error) {
        // If verification fails, return 403 Forbidden
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
