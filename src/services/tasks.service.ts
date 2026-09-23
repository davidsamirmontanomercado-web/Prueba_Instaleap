import {
  createTask,
  deleteTask,
  findTaskById,
  findTasksByUserId,
  Task,
  TaskStatus,
  updateTask,
} from "../persistence/tasks.repository";

import { AppError } from "../errors/AppError";
import { NotFoundError } from "../errors/NotFoundError";

interface CreateTaskData {
  userId: number;
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado?: TaskStatus;
}

interface UpdateTaskData {
  taskId: number;
  userId: number;
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado: TaskStatus;
}

const validStatuses: TaskStatus[] = [
  "pendiente",
  "en curso",
  "completada",
];

const validateTaskData = (
  titulo: string,
  estado: TaskStatus
): void => {
  if (!titulo || titulo.trim().length === 0) {
    throw new AppError(
      "El título de la tarea es obligatorio",
      400
    );
  }

  if (!validStatuses.includes(estado)) {
    throw new AppError(
      "El estado de la tarea no es válido",
      400
    );
  }
};

export const createNewTask = async (
  data: CreateTaskData
): Promise<Task> => {
  const {
    userId,
    titulo,
    descripcion = null,
    fecha_vencimiento = null,
    estado = "pendiente",
  } = data;

  validateTaskData(titulo, estado);

  return createTask(
    userId,
    titulo.trim(),
    descripcion ?? null,
    fecha_vencimiento ?? null,
    estado
  );
};

export const getUserTasks = async (
  userId: number
): Promise<Task[]> => {
  return findTasksByUserId(userId);
};

export const getTaskById = async (
  taskId: number,
  userId: number
): Promise<Task> => {
  const task = await findTaskById(taskId, userId);

  if (!task) {
    throw new NotFoundError(
      "Tarea no encontrada"
    );
  }

  return task;
};

export const updateUserTask = async (
  data: UpdateTaskData
): Promise<Task> => {
  const {
    taskId,
    userId,
    titulo,
    descripcion = null,
    fecha_vencimiento = null,
    estado,
  } = data;

  validateTaskData(titulo, estado);

  const task = await updateTask(
    taskId,
    userId,
    titulo.trim(),
    descripcion ?? null,
    fecha_vencimiento ?? null,
    estado
  );

  if (!task) {
    throw new NotFoundError(
      "Tarea no encontrada"
    );
  }

  return task;
};

export const deleteUserTask = async (
  taskId: number,
  userId: number
): Promise<Task> => {
  const task = await deleteTask(taskId, userId);

  if (!task) {
    throw new NotFoundError(
      "Tarea no encontrada"
    );
  }

  return task;
};