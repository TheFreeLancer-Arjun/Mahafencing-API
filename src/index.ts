/**
 * @file server.ts
 * @description Entry point for the LetMeRecall backend server using Express.js.
 *              Configures middleware, routes, sessions, and Passport.js authentication.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

// Local Imports
import './utils/passport'; // Passport strategy setup
import { PORT } from './config';

// Route Handlers
import { UserRouter } from './routes/UserRoutes';
import { ProfileRouter } from './routes/ProfileRoutes';
import { OauthRouter } from './routes/oauthRoutes';
import TodoRouter from './routes/TodoRoutes';

// Initialize Express App
const app = express();

/**
 * @middleware cookieParser
 * Parses cookies attached to the client request object.
 */
app.use(cookieParser());

/**
 * @middleware express.urlencoded
 * Parses URL-encoded bodies (as sent by HTML forms).
 */
app.use(express.urlencoded({ extended: true }));

/**
 * @middleware express.json
 * Parses incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * @middleware cors
 * Enables Cross-Origin Resource Sharing for specific frontend origins.
 */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://letmerecall.vercel.app',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));

/**
 * @middleware session
 * Initializes session support with cookie settings.
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret', // Replace in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true, // Prevents client-side JS from accessing the cookie
  },
}));

/**
 * @middleware passport
 * Initializes Passport.js and persistent login sessions.
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * @route /api/v1/auth/user
 * Handles user authentication (register, login, profile, etc.)
 */
app.use("/api/v1/auth/user", UserRouter);

/**
 * @route /api/v1/content
 * Handles creation and retrieval of content-related data.
 */
app.use("/api/v1/todo", TodoRouter);

/**
 * @route /api/v1/avatar
 * Handles avatar upload and retrieval.
 */
app.use("/api/v1/avatar", ProfileRouter);

/**
 * @route /auth
 * Handles OAuth-based authentication flows.
 */
app.use("/auth", OauthRouter);

/**
 * @route /
 * @description Basic health check for server status.
 */
app.get("/", (_req, res) => {
  res.send("LetMeRecall Server is up!!");
});

/**
 * @function app.listen
 * Starts the server and listens on the defined port.
 */
app.listen(PORT, () => {
  console.log(`BACKEND IS HOSTED : http://localhost:${PORT}`);
});
