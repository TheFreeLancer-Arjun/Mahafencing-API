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
      media
    } = req.body;

    if (!accountId || !title) {
      return res.status(400).json({
        message: "Missing required fields: accountId, title, or tags"
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
            create: media.map(
              (m: { url: string }) => ({
                publicUrl: m.url
              })
            )
          }
        : undefined
    };

    const newTodo = await prisma.todo.create({
      data: todoData,
      include: { media: true }
    });

    res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos ---------------------- */
export const getTodos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      include: { media: true }
    });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Update Todo ---------------------- */
export const updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
      subTasks
    } = req.body;

    const existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, accountId }
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
      subTasks: subTasks ?? []
    };

    Object.keys(updateData).forEach(
      key =>
        (updateData as any)[key] === undefined &&
        delete (updateData as any)[key]
    );

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
      include: { media: true }
    });

    res.status(200).json({ success: true, todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Delete Todo ---------------------- */
export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const todoId = req.params.id;
    const accountId = req.body.accountId;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, accountId }
    });

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found or no access" });
    }

    await prisma.todoMedia.deleteMany({ where: { todoId } });
    await prisma.todo.delete({ where: { id: todoId } });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Today's Todos ---------------------- */
export const getTodayTodos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todayStr = formatDate(new Date());

    const todos = await prisma.todo.findMany({
      where: { accountId, date: todayStr },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Tomorrow's Todos ---------------------- */
export const getTomorrowTodos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    const todos = await prisma.todo.findMany({
      where: { accountId, date: tomorrowStr }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Week's Todos ---------------------- */
export const getWeekTodos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
      where: { accountId, date: { in: dates } }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos With Links ---------------------- */
export const getTodosWithLinks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        NOT: { links: null }
      }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get Todos With Media ---------------------- */
export const getTodosWithMedia = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        media: { some: {} }
      },
      include: { media: true }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get All Private Todos ---------------------- */
export const getAllPrivateTodos = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const todos = await prisma.todo.findMany({
      where: {
        accountId,
        visibility: "Private"
      }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

/* ---------------------- Get All Public Todos ---------------------- */
export const getAllPublicTodos = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        visibility: "Public"
      }
    });

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};
