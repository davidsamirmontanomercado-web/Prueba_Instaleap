// Importa dotenv, una librería que permite cargar variables de entorno desde un archivo .env.
import dotenv from "dotenv";
// Carga las variables definidas en el archivo .env dentro de process.env.
dotenv.config();
// Crea y exporta un objeto con la configuración de la aplicación.
export const env = {

  // Obtiene el puerto desde la variable de entorno PORT.
  // Si PORT no está definida o no contiene un número válido, utiliza el puerto 3000.
  port: Number(process.env.PORT) || 3000,

  // Contiene la configuración necesaria para conectarse a la base de datos.
  database: {

    // Obtiene el servidor de la base de datos desde DB_HOST.
    // Si no está definido, utiliza "localhost".
    host: process.env.DB_HOST || "localhost",

    // Obtiene el puerto de PostgreSQL desde DB_PORT.
    // Si no está definido o no es válido, utiliza el puerto 5432.
    port: Number(process.env.DB_PORT) || 5432,

    // Obtiene el nombre de la base de datos desde DB_NAME.
    // Si no está definido, utiliza una cadena vacía.
    name: process.env.DB_NAME || "",

    // Obtiene el usuario de PostgreSQL desde DB_USER.
    // Si no está definido, utiliza una cadena vacía.
    user: process.env.DB_USER || "",

    // Obtiene la contraseña de PostgreSQL desde DB_PASSWORD.
    // Si no está definida, utiliza una cadena vacía.
    password: process.env.DB_PASSWORD || "",

  },

};