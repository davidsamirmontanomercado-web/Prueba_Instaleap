// Importa Pool desde la librería pg para crear y administrar conexiones con PostgreSQL.
import { Pool } from "pg";

// Importa la configuración de las variables de entorno de la aplicación.
import { env } from "../config/env";

// Crea un pool de conexiones para administrar múltiples conexiones con PostgreSQL.
export const pool = new Pool({
  // Indica el servidor donde está alojada la base de datos.
  host: env.database.host,

  // Indica el puerto utilizado por PostgreSQL.
  port: env.database.port,

  // Indica el nombre de la base de datos a la que se va a conectar.
  database: env.database.name,

  // Indica el usuario utilizado para autenticarse en PostgreSQL.
  user: env.database.user,

  // Indica la contraseña utilizada para autenticarse en PostgreSQL.
  password: env.database.password,
});

// Define una función asíncrona para comprobar la conexión con la base de datos.
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    // Solicita una conexión disponible del pool de conexiones.
    const client = await pool.connect();

    // Muestra un mensaje en consola cuando la conexión se realiza correctamente.
    console.log("PostgreSQL conectado correctamente");

    // Libera la conexión para que pueda ser utilizada nuevamente por el pool.
    client.release();
  } catch (error) {
    // Muestra en consola el error ocurrido durante el intento de conexión.
    console.error("Error al conectar con PostgreSQL:", error);

    // Vuelve a lanzar el error para que pueda ser manejado por otra parte de la aplicación.
    throw error;
  }
};