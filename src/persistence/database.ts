import { Pool } from "pg";
import { env } from "../config/env";

/**
 * Pool de conexiones utilizado para comunicarse
 * con la base de datos PostgreSQL.
 */
export const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
});

/**
 * Verifica la conexión con PostgreSQL.
 *
 * Obtiene temporalmente una conexión del pool y la libera
 * después de comprobar que la base de datos está disponible.
 *
 * @returns Promise que se resuelve cuando la conexión
 * ha sido verificada correctamente.
 * @throws Error Si no es posible establecer la conexión.
 */
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL conectado correctamente");

    client.release();
  } catch (error) {
    console.error(
      "Error al conectar con PostgreSQL:",
      error
    );

    throw error;
  }
};