import { Request, Response  } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma";
import {
  signinValidationSchema,
  signupValidationSchema,
} from "../utils/zodSchema";
import { JWT_USER_SECRET } from "../config";

// ✅ SIGNUP
export const signup = async (req: Request, res: Response) : Promise<any> => {
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
        create: { username },
      },
    },
    include: { accounts: true },
  });

  const defaultAccountId = user.accounts[0].id;

  await prisma.user.update({
    where: { id: user.id },
    data: { activeAccountId: defaultAccountId },
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
        activeAccountId: defaultAccountId,
      },
    });
};

// ✅ SIGNIN
export const signin = async (req: Request, res: Response) : Promise<any> => {
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
    include: { accounts: true },
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
      message: "Signin successful",
      user: {
        id: user.id,
        email: user.email,
        accounts: user.accounts,
        activeAccountId: user.activeAccountId,
      },
    });
};

// ✅ LOGOUT
export const logout = async (req: Request, res: Response) : Promise<any> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ message: "User Logged Out Successfully!" });
};

// ✅ GET CURRENT USER
export const me = async (req: Request, res: Response) : Promise<any> => {
  const userId = (req as any).user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      accounts: user.accounts,
      activeAccountId: user.activeAccountId,
    },
  });
};

// ✅ CREATE ACCOUNT
export const createAccount = async (req: Request, res: Response) : Promise<any> => {
  const userId = (req as any).user?.id;
  const { username } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.accounts.length >= 5)
    return res.status(400).json({ message: "Max 5 accounts allowed" });

  const duplicate = await prisma.account.findFirst({
    where: { userId, username },
  });
  if (duplicate)
    return res.status(409).json({ message: "Account already exists" });

  const newAccount = await prisma.account.create({
    data: { username, userId },
  });

  return res.status(201).json({ message: "Account created", account: newAccount });
};

// ✅ DELETE ACCOUNT (with cascade)
export const deleteAccount = async (req: Request, res: Response) : Promise<any> => {
  const userId = (req as any).user?.id;
  const accountId = req.params.id;

  const account = await prisma.account.findUnique({ where: { id: accountId } });

  if (!account || account.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized or not found" });
  }

  // ❗️Cascade delete: Prisma handles `Todo`, `TodoMedia`, `Profile` via schema
  await prisma.account.delete({ where: { id: accountId } });

  // Reset activeAccountId if needed
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.activeAccountId === accountId) {
    await prisma.user.update({
      where: { id: userId },
      data: { activeAccountId: null },
    });
  }

  return res.status(200).json({ message: "Account and related data deleted" });
};

// ✅ SWITCH ACCOUNT
export const switchAccount = async (req: Request, res: Response) : Promise<any> => {
  const userId = (req as any).user?.id;
  const { accountId } = req.body;

  const account = await prisma.account.findUnique({ where: { id: accountId } });

  if (!account || account.userId !== userId) {
    return res.status(403).json({ message: "Invalid account" });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { activeAccountId: accountId },
  });

  return res.status(200).json({ message: "Switched active account", accountId });
};

// ✅ SESSION CHECK
export const session = async (req: Request, res: Response) : Promise<any> => {
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
          accounts: user.accounts,
          activeAccountId: user.activeAccountId,
        },
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return res
      .status(200)
      .json({ message: { isAuthenticated: false, user: null } });
  }
};
