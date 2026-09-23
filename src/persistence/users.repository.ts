// Importa el pool de conexiones configurado para PostgreSQL.
import { pool } from "./database";

// Define la estructura que representa a un usuario en la aplicación.
export interface User {
  // Identificador único del usuario.
  id: number;

  // Nombre del usuario.
  nombre: string;

  // Correo electrónico del usuario.
  email: string;

  // Contraseña almacenada de forma segura mediante un hash.
  password_hash: string;

  // Fecha y hora en la que se creó el usuario.
  created_at: Date;
}

// Busca un usuario en la base de datos utilizando su correo electrónico.
export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  // Ejecuta una consulta SQL para buscar el usuario por su correo.
  const result = await pool.query<User>(
    `
      SELECT id, nombre, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `,
    // Envía el correo como valor del parámetro $1.
    [email]
  );

  // Devuelve el primer usuario encontrado o null si no existe.
  return result.rows[0] ?? null;
};

// Crea un nuevo usuario en la base de datos.
export const createUser = async (
  nombre: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  // Ejecuta una consulta SQL para insertar el nuevo usuario.
  const result = await pool.query<User>(
    `
      INSERT INTO users (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, password_hash, created_at
    `,
    // Envía los valores que reemplazarán los parámetros $1, $2 y $3.
    [nombre, email, passwordHash]
  );

  // Devuelve el usuario recién creado.
  return result.rows[0];
};