import { Response, NextFunction } from "express";

import {
  AuthenticatedRequest,
} from "../api/middlewares/auth.middleware";

import {
  createNewTask,
  deleteUserTask,
  getTaskById,
  getUserTasks,
  updateUserTask,
} from "../services/tasks.service";

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const {
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    } = req.body;

    const task = await createNewTask({
      userId,
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    });

    res.status(201).json({
      message: "Tarea creada correctamente",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const tasks = await getUserTasks(userId);

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({
        error: "El ID de la tarea no es válido",
      });

      return;
    }

    const task = await getTaskById(taskId, userId);

    res.status(200).json({
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({
        error: "El ID de la tarea no es válido",
      });

      return;
    }

    const {
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    } = req.body;

    const task = await updateUserTask({
      taskId,
      userId,
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    });

    res.status(200).json({
      message: "Tarea actualizada correctamente",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      res.status(400).json({
        error: "El ID de la tarea no es válido",
      });

      return;
    }

    const task = await deleteUserTask(taskId, userId);

    res.status(200).json({
      message: "Tarea eliminada correctamente",
      task,
    });
  } catch (error) {
    next(error);
  }
};