/**
 * @file AvatarRoutes.ts
 * @description Defines API routes related to user avatar upload and retrieval.
 *              All routes are protected and require user authentication.
 */

import { Router } from 'express';
import { UserAuth } from '../middlewares/UserAuthentication';
import { getProfile, uploadProfile } from '../controllers/ProfileController';

export const ProfileRouter = Router();

/**
 * @route POST /upload
 * @description Uploads a new avatar image for the authenticated user.
 *              Expects multipart/form-data with the avatar file.
 * @access Protected - requires valid JWT token
 */
ProfileRouter.post('/upload-profile', UserAuth, uploadProfile);



/**
 * @route GET /get-avatar
 * @description Retrieves the currently uploaded avatar of the authenticated user.
 * @access Protected - requires valid JWT token
 */
ProfileRouter.get("/get-profile", UserAuth, getProfile);
