// Importa el pool de conexiones configurado para PostgreSQL.
import { pool } from "./database";

// Define la estructura que tendrá una tarea dentro de la aplicación.
export interface Task {
  // Identificador único de la tarea.
  id: number;

  // Identificador del usuario propietario de la tarea.
  user_id: number;

  // Título de la tarea.
  titulo: string;

  // Descripción de la tarea. Puede ser texto o null si no tiene descripción.
  descripcion: string | null;

  // Fecha de vencimiento de la tarea. Puede ser una fecha o null.
  fecha_vencimiento: Date | null;

  // Estado permitido para la tarea.
  estado: "pendiente" | "en curso" | "completada";

  // Fecha y hora en la que se creó la tarea.
  created_at: Date;
}

// Busca todas las tareas pertenecientes a un usuario específico.
export const findTasksByUserId = async (
  userId: number
): Promise<Task[]> => {
  // Ejecuta una consulta SQL para obtener las tareas del usuario.
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
    // Envía el ID del usuario como valor del parámetro $1.
    [userId]
  );

  // Devuelve las filas obtenidas de la consulta.
  return result.rows;
};

// Busca una tarea específica perteneciente a un usuario.
export const findTaskById = async (
  taskId: number,
  userId: number
): Promise<Task | null> => {
  // Ejecuta una consulta SQL buscando la tarea por su ID y por el ID del usuario.
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
    // Envía los valores que reemplazarán los parámetros $1 y $2.
    [taskId, userId]
  );

  // Devuelve la primera tarea encontrada o null si no existe.
  return result.rows[0] ?? null;
};