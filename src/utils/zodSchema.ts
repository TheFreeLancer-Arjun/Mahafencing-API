/**
 * @file zodSchema.ts
 * @description Defines Zod validation schemas for user authentication and Todo creation,
 * matching the Prisma models.
 */

import { z } from "zod";

/* ---------------------- ENUMS for Todo Fields ---------------------- */

export const PriorityTypeEnum = z.enum(["High", "Medium", "Low"]);
export const ListTypeEnum = z.enum(["Personal", "Work"]);
export const VisibilityTypeEnum = z.enum(["Public", "Private"]);

/* ---------------------- Todo Validation Schema ---------------------- */

export const TodoValidationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),

  description: z
    .string()
    .max(500, { message: "Description max 500 characters" })
    .optional(),

  links: z
    .preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().url({ message: "Links must be a valid URL" }).optional()
    ),

  priority: PriorityTypeEnum.optional(),

  list: ListTypeEnum.optional(),

  visibility: VisibilityTypeEnum.optional(),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" })
    .optional(),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Time must be in HH:mm format" })
    .optional(),

  tags: z
    .array(z.string())
    .nonempty({ message: "Tags must be a non-empty array of strings" }),

  subTasks: z.array(z.string()).optional(),

  media: z
    .array(
      z.object({
        publicId: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
});

/* ---------------------- Auth Validation Schemas ---------------------- */

/**
 * @description Validation for user signup (Account creation).
 */
export const signupValidationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be under 30 characters" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password too long" }),
});

/**
 * @description Validation for user signin.
 */
export const signinValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, { message: "Password is required" }),
});
