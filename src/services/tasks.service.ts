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

/**
 * Valida las reglas básicas de una tarea antes de procesarla.
 *
 * @param titulo Título de la tarea.
 * @param estado Estado de la tarea.
 * @throws AppError Si el título está vacío o el estado no es válido.
 */
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

/**
 * Crea una nueva tarea asociada a un usuario.
 *
 * @param data Datos necesarios para crear la tarea.
 * @returns La tarea creada.
 */
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

/**
 * Obtiene todas las tareas pertenecientes a un usuario.
 *
 * @param userId Identificador del usuario autenticado.
 * @returns Lista de tareas del usuario.
 */
export const getUserTasks = async (
  userId: number
): Promise<Task[]> => {
  return findTasksByUserId(userId);
};

/**
 * Obtiene una tarea específica perteneciente a un usuario.
 *
 * @param taskId Identificador de la tarea.
 * @param userId Identificador del usuario autenticado.
 * @returns La tarea encontrada.
 * @throws NotFoundError Si la tarea no existe o no pertenece al usuario.
 */
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

/**
 * Actualiza una tarea perteneciente a un usuario.
 *
 * @param data Datos necesarios para actualizar la tarea.
 * @returns La tarea actualizada.
 * @throws NotFoundError Si la tarea no existe o no pertenece al usuario.
 */
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

/**
 * Elimina una tarea perteneciente a un usuario.
 *
 * @param taskId Identificador de la tarea.
 * @param userId Identificador del usuario autenticado.
 * @returns La tarea eliminada.
 * @throws NotFoundError Si la tarea no existe o no pertenece al usuario.
 */
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