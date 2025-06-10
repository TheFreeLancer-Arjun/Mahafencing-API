import { Router } from "express";
import { UserAuth } from "../middlewares/UserAuthentication";

import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodayTodos,
  getTomorrowTodos,
  getWeekTodos,
  getTodosWithLinks,
  getTodosWithMedia,
  getAllPrivateTodos,
  getAllPublicTodos,
} from "../controllers/TodoController";

const TodoRouter = Router();

// 📌 CRUD routes
TodoRouter.post("/create", UserAuth, createTodo);
TodoRouter.get("/all", UserAuth, getTodos);
TodoRouter.put("/update/:id", UserAuth, updateTodo);
TodoRouter.delete("/delete/:id", UserAuth, deleteTodo);

// 📅 Date-based filters
TodoRouter.get("/today", UserAuth, getTodayTodos);
TodoRouter.get("/tomorrow", UserAuth, getTomorrowTodos);
TodoRouter.get("/week", UserAuth, getWeekTodos);

// 🔗 Extra filters
TodoRouter.get("/with-links", UserAuth, getTodosWithLinks);
TodoRouter.get("/with-media", UserAuth, getTodosWithMedia);
TodoRouter.get("/private", UserAuth, getAllPrivateTodos);
TodoRouter.get("/public", UserAuth, getAllPublicTodos);

export default TodoRouter;
