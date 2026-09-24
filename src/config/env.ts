
import dotenv from "dotenv";
dotenv.config();
// Crea y exporta un objeto con la configuración de la aplicación.
export const env = {

  port: Number(process.env.PORT) || 3000,

  database: {

    host: process.env.DB_HOST || "localhost",

    port: Number(process.env.DB_PORT) || 5432,

    name: process.env.DB_NAME || "",

    user: process.env.DB_USER || "",
    
    password: process.env.DB_PASSWORD || "",

  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
  },
};