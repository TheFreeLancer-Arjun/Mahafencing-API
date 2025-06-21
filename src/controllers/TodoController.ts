import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

/* ---------------------- Utility Function ---------------------- */
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getTodoStats = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Get account to find userId
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true }, // include user to get username directly
    });

    if (!account || !account.user) {
      return res.status(404).json({ message: "Account or User not found" });
    }

    const username = account.user.username;

    // Fetch todos
    const todos = await prisma.todo.findMany({
      where: { accountId },
      select: { status: true },
    });

    const total = todos.length;
    const done = todos.filter((todo) => todo.status === "done").length;
    const rejected = todos.filter((todo) => todo.status === "rejected").length;
    const pending = todos.filter((todo) => todo.status === "pending").length;

    const bestResult = total > 0 ? Math.max(done, rejected, pending) : 0;
    const growth =
      total > 0 ? Math.round(((done + rejected) / total) * 100) : 0;

    return res.status(200).json({
      username,
      stats: {
        total,
        done,
        rejected,
        pending,
        bestResult,
        growthPercent: `${growth}%`,
        overallScore:
          growth > 75
            ? "Excellent"
            : growth > 50
            ? "Above Average"
            : "Needs Improvement",
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------- Create Todo ---------------------- */
export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      accountId,
      title,
      tags,
      description,
      links,
      priority,
      list,
      visibility,
      date,
      time,
      subTasks,
      media,
    } = req.body;

    if (!accountId || !title) {
      return res.status(400).json({
        message: "Missing required fields: accountId, title,",
      });
    }

    const todoData: Prisma.TodoUncheckedCreateInput = {
      accountId,
      title,
      tags,
      description,
      links,
      priority,
      list,
      visibility,
      date,
      time,
      subTasks: subTasks ?? [],
      media: media
        ? {
            create: media.map((m: { url: string }) => ({
              publicUrl: m.url,
            })),
          }
        : undefined,
    };

    const newTodo = await prisma.todo.create({
      data: todoData,
      include: { media: true },
    });

    res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos ---------------------- */
export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      include: { media: true },
    });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Update Todo ---------------------- */
export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = req.params.id;
    const accountId = req.body.accountId;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const {
      title,
      tags,
      description,
      links,
      priority,
      list,
      visibility,
      date,
      time,
      subTasks,
    } = req.body;

    const existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, accountId },
    });

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found or no access" });
    }

    const updateData: Partial<Prisma.TodoUpdateInput> = {
      title,
      tags,
      description,
      links,
      priority,
      list,
      visibility,
      date,
      time,
      subTasks: subTasks ?? [],
    };

    Object.keys(updateData).forEach(
      (key) =>
        (updateData as any)[key] === undefined &&
        delete (updateData as any)[key]
    );

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
      include: { media: true },
    });

    res.status(200).json({ success: true, todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};
/* ---------------------- Update  Todo  Status  ---------------------- */

export const updateTodoStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = req.params.id;
    const { accountId, status } = req.body;

    if (!accountId || !status) {
      return res
        .status(400)
        .json({ message: "Account ID and status are required" });
    }

    if (!["pending", "done", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const todo = await prisma.todo.findFirst({
      where: { id: todoId, accountId },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or no access" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { status },
    });

    res.status(200).json({ success: true, todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Delete Todo ---------------------- */
export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todoId = req.params.id;
    const accountId = req.body?.accountId;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Verify the todo exists and belongs to this account
    const existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, accountId },
    });

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found or no access" });
    }

    // Just delete the todo - media will be deleted automatically due to onDelete: Cascade
    await prisma.todo.delete({ where: { id: todoId } });

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    next(error);
  }
};
/* ---------------------- Get Today's Todos ---------------------- */
export const getTodayTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todayStr = formatDate(new Date());

    const todos = await prisma.todo.findMany({
      where: { accountId, date: todayStr },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Tomorrow's Todos ---------------------- */
export const getTomorrowTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    const todos = await prisma.todo.findMany({
      where: { accountId, date: tomorrowStr },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Week's Todos ---------------------- */
export const getWeekTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const today = new Date();
    const dates: string[] = [];

    for (let i = 0; i <= 6 - today.getDay(); i++) {
      const temp = new Date(today);
      temp.setDate(today.getDate() + i);
      dates.push(formatDate(temp));
    }

    const todos = await prisma.todo.findMany({
      where: { accountId, date: { in: dates } },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos With Links ---------------------- */
export const getTodosWithLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        links: {
          not: { equals: null },
        },
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos With Media ---------------------- */
export const getTodosWithMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        media: { some: {} },
      },
      include: { media: true },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get All Private Todos ---------------------- */
export const getAllPrivateTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        visibility: "Private",
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get All Public Todos ---------------------- */
export const getAllPublicTodos = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        visibility: "Public",
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};
