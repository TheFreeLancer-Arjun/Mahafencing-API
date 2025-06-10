import { Router } from "express";
import { 
  signup, 
  signin, 
  logout, 
  me, 
  session, 

} from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";

 export const UserRouter = Router();

// Public routes
UserRouter.post("/signup", signup);
UserRouter.post("/signin", signin);
UserRouter.post("/logout", logout);

// Protected routes (require authentication)
UserRouter.get("/me", UserAuth, me);
UserRouter.get("/session", UserAuth, session);

