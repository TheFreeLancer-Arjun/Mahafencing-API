/**
 * @file config.ts
 * @description Loads environment variables using dotenv and exports configuration constants
 *              used throughout the application such as port, secrets, OAuth credentials,
 *              and Cloudinary keys.
 */

import { config } from "dotenv";

// Load environment variables from .env file into process.env
config();

/**
 * @constant PORT
 * @description The port on which the server will run. Defaults to 3000 if not set.
 */
export const PORT: number = Number(process.env.PORT) || 3000;

/**
 * @constant JWT_USER_SECRET
 * @description Secret key used for signing and verifying JWT tokens for user authentication.
 */
export const JWT_USER_SECRET: string = process.env.JWT_USER_SECRET || '';

/**
 * @constant FRONTEND_URL
 * @description The base URL of the frontend application for CORS and redirects.
 */
export const FRONTEND_URL: string = process.env.FRONTEND_URL || '';

/**
 * @constant COOKIE_DOMAIN
 * @description The domain scope for cookies, useful for cross-subdomain cookies.
 */
export const COOKIE_DOMAIN: string | undefined = process.env.COOKIE_DOMAIN;

/**
 * @constant CLOUDINARY_CLOUD_NAME
 * @description Cloudinary cloud name for media upload and management.
 */
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || '';

/**
 * @constant CLOUDINARY_API_KEY
 * @description API key for authenticating with Cloudinary services.
 */
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || '';

/**
 * @constant CLOUDINARY_API_SECRET
 * @description API secret key for Cloudinary authentication.
 */
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || '';

/**
 * @constant GOOGLE_CLIENT_ID
 * @description OAuth client ID for Google login integration.
 */
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || '';

/**
 * @constant GOOGLE_CLIENT_SECRET
 * @description OAuth client secret for Google login integration.
 */
export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || '';

/**
 * @constant GITHUB_CLIENT_ID
 * @description OAuth client ID for GitHub login integration.
 */
export const GITHUB_CLIENT_ID: string = process.env.GITHUB_CLIENT_ID || '';

/**
 * @constant GITHUB_CLIENT_SECRET
 * @description OAuth client secret for GitHub login integration.
 */
export const GITHUB_CLIENT_SECRET: string = process.env.GITHUB_CLIENT_SECRET || '';

/**
 * @constant BASE_URL
 * @description Base URL for the backend server, used in OAuth callback URLs.
 */
export const BASE_URL: string = process.env.BASE_URL || 'http://localhost:3001';
