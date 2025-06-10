// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma";
import {
  signinValidationSchema,
  signupValidationSchema,
} from "../utils/zodSchema";
import { JWT_USER_SECRET } from "../config";

// ✅ SIGNUP
export const signup = async (req: Request, res: Response): Promise<any> => {
  const result = signupValidationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password, username } = result.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      accounts: {
        create: { username }, // 👈 default account
      },
    },
    include: {
      accounts: true,
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_USER_SECRET, {
    expiresIn: "7d",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .status(201)
    .json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        accounts: user.accounts,
      },
      activeAccountId: user.accounts[0].id, // 👈 default login account
    });
};

// ✅ CREATE ACCOUNT
export const createAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, username } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.accounts.length >= 5) {
    return res
      .status(400)
      .json({ message: "You can only create up to 5 accounts." });
  }

  const newAccount = await prisma.account.create({
    data: { username, userId },
  });

  res.status(201).json({ message: "Account created", account: newAccount });
};

// ✅ SIGNIN
export const signin = async (req: Request, res: Response): Promise<any> => {
  const result = signinValidationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: { include: { profiles: true } },
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_USER_SECRET, {
    expiresIn: "7d",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .status(200)
    .json({
      message: "User signed in",
      user: {
        id: user.id,
        email: user.email,
        accounts: user.accounts,
      },
    });
};

// ✅ LOGOUT
export const logout = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ message: "User Logged Out Successfully!" });
};

// ✅ ME
export const me = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "ACCESS DENIED" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      accounts: user.accounts.map((acc) => ({
        id: acc.id,
        username: acc.username,
      })),
    },
  });
};

// ✅ SESSION
export const session = async (req: Request, res: Response): Promise<any> => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1] ||
    req.query.token;

  if (!token) {
    return res
      .status(200)
      .json({ message: { isAuthenticated: false, user: null } });
  }

  try {
    const decoded = jwt.verify(token, JWT_USER_SECRET) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { accounts: true },
    });

    if (!user) {
      return res
        .status(200)
        .json({ message: { isAuthenticated: false, user: null } });
    }

    return res.status(200).json({
      message: {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          accounts: user.accounts.map((a) => ({
            id: a.id,
            username: a.username,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return res
      .status(200)
      .json({ message: { isAuthenticated: false, user: null } });
  }
};
