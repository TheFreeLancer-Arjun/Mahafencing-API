/**
 * @file passport.ts
 * @description Configures Passport Google and GitHub OAuth strategies with full TypeScript types,
 *              including user serialization and deserialization. Handles creating new users if needed.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback as GoogleVerifyCallback } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { generateHashedPassword } from './generateHash';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  BASE_URL,
} from '../config';
import prisma from '../db/prisma';

passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/auth/google/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: GoogleVerifyCallback
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email found in Google profile'));

          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                username: profile.displayName || `user-${Math.random().toString(36).slice(2, 9)}`,
                password: await generateHashedPassword(),
                isMailVerified: true,
                provider: 'google',
                providerId: profile.id,
              },
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth credentials missing, skipping Google OAuth strategy.');
}

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/auth/github/callback`,
        scope: ['user:email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: (error: any, user?: any) => void
      ) => {
        try {
          // GitHubProfile.emails has type: Array<{ value: string; type?: string }>
          // But 'primary' is not standard in typings, so cast to any to check or find by 'primary' property.

          const emails = profile.emails as Array<{ value: string; primary?: boolean }>;

          // Find primary email or fallback to first email
          const primaryEmail = emails?.find(email => email.primary)?.value || emails?.[0]?.value;

          if (!primaryEmail) return done(new Error('No email found in GitHub profile'));

          let user = await prisma.user.findUnique({ where: { email: primaryEmail } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: primaryEmail,
                username: profile.username || `user-${Math.random().toString(36).slice(2, 9)}`,
                password: await generateHashedPassword(),
                isMailVerified: true,
                provider: 'github',
                providerId: profile.id,
              },
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
} else {
  console.warn('GitHub OAuth credentials missing, skipping GitHub OAuth strategy.');
}
