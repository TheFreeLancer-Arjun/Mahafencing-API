/**
 * @file oauthRoutes.ts
 * @description Defines OAuth authentication routes using Passport.js for Google and GitHub providers.
 *              Handles authentication initiation, callbacks, JWT token generation, cookie setting,
 *              and redirects to frontend with the token.
 */

import jwt from 'jsonwebtoken';
import { Router } from 'express';
import passport from 'passport';
import {
    logout,
    authFailure,
} from '../controllers/oauthController';
import { FRONTEND_URL, JWT_USER_SECRET } from '../config';

export const OauthRouter = Router();

/**
 * @route GET /auth/google
 * @description Initiates Google OAuth2 authentication flow requesting profile and email scopes.
 *              Uses Passport.js Google strategy. Sessions are disabled in favor of JWT.
 */
OauthRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

/**
 * @route GET /auth/google/callback
 * @description Handles Google OAuth2 callback.
 *              On success:
 *                - Generates a JWT token with user ID and email.
 *                - Sets a secure HTTP-only cookie containing the token.
 *                - Redirects user to frontend dashboard with token as URL param fallback.
 *              On failure:
 *                - Redirects to /auth/failure endpoint.
 */
OauthRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        session: false
    }),
    (req, res) => {
        if (!req.user) {
            res.redirect('/auth/failure');
            return;
        }

        // Generate JWT token valid for 4 days
        const token = jwt.sign(
            {
                id: (req.user as any).id,
                email: (req.user as any).email
            },
            JWT_USER_SECRET,
            { expiresIn: "4d" }
        );

        // Set token cookie with secure flags
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
            path: "/",
        });

        // Redirect to frontend dashboard, attaching token as fallback query param
        const redirectUrl = new URL(`${FRONTEND_URL}/dashboard`);
        redirectUrl.searchParams.set('token', token);

        res.redirect(redirectUrl.toString());
    }
);

/**
 * @route GET /auth/github
 * @description Initiates GitHub OAuth authentication flow requesting user's email scope.
 *              Uses Passport.js GitHub strategy. Sessions are disabled in favor of JWT.
 */
OauthRouter.get('/github', passport.authenticate('github', {
    scope: ['user:email'],
    session: false
}));

/**
 * @route GET /auth/github/callback
 * @description Handles GitHub OAuth callback.
 *              On success:
 *                - Generates a JWT token with user ID and email.
 *                - Sets a secure HTTP-only cookie containing the token.
 *                - Redirects user to frontend dashboard with token as URL param fallback.
 *              On failure:
 *                - Redirects to frontend auth failure page.
 */
OauthRouter.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/auth/failure',
        session: false
    }),
    (req, res) => {
        if (!req.user) {
            return res.redirect(`${FRONTEND_URL}/auth/failure`);
        }

        const user = req.user as any;

        // Generate JWT token valid for 4 days
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_USER_SECRET,
            { expiresIn: "4d" }
        );

        // Set token cookie with secure flags
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
            path: "/",
        });

        // Redirect to frontend dashboard, attaching token as fallback query param
        const redirectUrl = new URL(`${FRONTEND_URL}/dashboard`);
        redirectUrl.searchParams.set('token', token);

        res.redirect(redirectUrl.toString());
    }
);

/**
 * @route GET /auth/logout
 * @description Logs out the user by invoking the logout controller.
 */
OauthRouter.get('/logout', logout);

/**
 * @route GET /auth/failure
 * @description Handles OAuth failure scenarios.
 */
OauthRouter.get('/failure', authFailure);
