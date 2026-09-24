import { pool } from "./database";

/**
 * Representa un usuario almacenado en la base de datos.
 */
export interface User {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

/**
 * Busca un usuario por su correo electrónico.
 *
 * @param email Correo electrónico del usuario.
 * @returns El usuario encontrado o null si no existe.
 */
export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  const result = await pool.query<User>(
    `
      SELECT id, nombre, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] ?? null;
};

/**
 * Crea un nuevo usuario en la base de datos.
 *
 * @param nombre Nombre del usuario.
 * @param email Correo electrónico del usuario.
 * @param passwordHash Contraseña almacenada como hash.
 * @returns El usuario creado.
 */
export const createUser = async (
  nombre: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  const result = await pool.query<User>(
    `
      INSERT INTO users (nombre, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, password_hash, created_at
    `,
    [nombre, email, passwordHash]
  );

  return result.rows[0];
};