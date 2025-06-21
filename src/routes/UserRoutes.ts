import { Router } from "express";
import {
  signup,
  signin,
  logout,
  me,
  session,
  createAccount,
  deleteAccount,
  switchAccount,
} from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";

export const UserRouter = Router();

UserRouter.post("/signup", signup);
UserRouter.post("/signin", signin);
UserRouter.post("/logout", logout);

UserRouter.get("/me", UserAuth, me);
UserRouter.get("/session", UserAuth, session);

UserRouter.post("/accounts", UserAuth, createAccount);

UserRouter.delete("/accounts/:id", UserAuth, deleteAccount);
UserRouter.post("/switch-account", UserAuth, switchAccount);

