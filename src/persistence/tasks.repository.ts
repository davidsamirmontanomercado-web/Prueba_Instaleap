import { pool } from "./database";

export type TaskStatus = "pendiente" | "en curso" | "completada";

export interface Task {
  id: number;
  user_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: string | null;
  estado: TaskStatus;
  created_at: Date;
}
/**
 * Crea una tarea en la base de datos.
 *
 * @param userId Identificador del usuario propietario.
 * @param titulo Título de la tarea.
 * @param descripcion Descripción de la tarea.
 * @param fechaVencimiento Fecha límite de la tarea.
 * @param estado Estado inicial de la tarea.
 * @returns La tarea creada.
 */
export const createTask = async (
  userId: number,
  titulo: string,
  descripcion: string | null,
  fechaVencimiento: string | null,
  estado: TaskStatus
): Promise<Task> => {
  const result = await pool.query<Task>(
    `
      INSERT INTO tasks (
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado,
        created_at
    `,
    [userId, titulo, descripcion, fechaVencimiento, estado]
  );

  return result.rows[0];
};

/**
 * Obtiene todas las tareas pertenecientes a un usuario.
 *
 * @param userId Identificador del usuario propietario.
 * @returns Lista de tareas del usuario.
 */
export const findTasksByUserId = async (
  userId: number
): Promise<Task[]> => {
  const result = await pool.query<Task>(
    `
      SELECT
        id,
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado,
        created_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY id DESC
    `,
    [userId]
  );

  return result.rows;
};

/**
 * Obtiene todas las tareas pertenecientes a un usuario.
 *
 * @param userId Identificador del usuario propietario.
 * @returns Lista de tareas del usuario.
 */
export const findTaskById = async (
  taskId: number,
  userId: number
): Promise<Task | null> => {
  const result = await pool.query<Task>(
    `
      SELECT
        id,
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado,
        created_at
      FROM tasks
      WHERE id = $1
        AND user_id = $2
    `,
    [taskId, userId]
  );

  return result.rows[0] ?? null;
};

/**
 * Actualiza una tarea perteneciente a un usuario.
 *
 * @param taskId Identificador de la tarea.
 * @param userId Identificador del usuario propietario.
 * @param titulo Nuevo título de la tarea.
 * @param descripcion Nueva descripción de la tarea.
 * @param fechaVencimiento Nueva fecha de vencimiento.
 * @param estado Nuevo estado de la tarea.
 * @returns La tarea actualizada o null si no existe.
 */
export const updateTask = async (
  taskId: number,
  userId: number,
  titulo: string,
  descripcion: string | null,
  fechaVencimiento: string | null,
  estado: TaskStatus
): Promise<Task | null> => {
  const result = await pool.query<Task>(
    `
      UPDATE tasks
      SET
        titulo = $1,
        descripcion = $2,
        fecha_vencimiento = $3,
        estado = $4
      WHERE id = $5
        AND user_id = $6
      RETURNING
        id,
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado,
        created_at
    `,
    [
      titulo,
      descripcion,
      fechaVencimiento,
      estado,
      taskId,
      userId,
    ]
  );

  return result.rows[0] ?? null;
};

/**
 * Elimina una tarea perteneciente a un usuario.
 *
 * @param taskId Identificador de la tarea.
 * @param userId Identificador del usuario propietario.
 * @returns La tarea eliminada o null si no existe.
 */
export const deleteTask = async (
  taskId: number,
  userId: number
): Promise<Task | null> => {
  const result = await pool.query<Task>(
    `
      DELETE FROM tasks
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        user_id,
        titulo,
        descripcion,
        fecha_vencimiento,
        estado,
        created_at
    `,
    [taskId, userId]
  );

  return result.rows[0] ?? null;
};