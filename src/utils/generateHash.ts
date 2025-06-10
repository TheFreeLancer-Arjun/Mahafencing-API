/**
 * @file generateHashedPassword.ts
 * @description Utility function to generate a random 10-character string and return its bcrypt hash.
 */

import bcrypt from 'bcrypt';

/**
 * Generates a 10-character random password string and returns its bcrypt hash.
 *
 * @async
 * @function generateHashedPassword
 * @returns {Promise<string>} A promise that resolves to the hashed password string.
 *
 * @example
 * const hashed = await generateHashedPassword();
 * console.log(hashed); // $2b$10$...
 */
export async function generateHashedPassword(): Promise<string> {
    const randomPassword = Math.random().toString(36).slice(-10); // 10-char random string
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    return hashedPassword;
}
