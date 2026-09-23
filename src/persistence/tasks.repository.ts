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