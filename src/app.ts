// Importa Express, framework utilizado para crear el servidor y manejar las rutas de la API.
import express from "express";

// Importa la configuración de variables de entorno de la aplicación.
import { env } from "./config/env";

// Importa la función encargada de probar la conexión con la base de datos.
import { testDatabaseConnection } from "./persistence/database";

// Importa el middleware encargado de manejar los errores que ocurran durante la ejecución de la aplicación.
import { errorMiddleware } from "./api/middlewares/error.middleware";

// Importa las rutas relacionadas con la autenticación de usuarios.
import authRoutes from "./api/routes/auth.routes";
// Crea una instancia de la aplicación de Express.
const app = express();

// Permite que Express pueda recibir y procesar información enviada en formato JSON.
app.use(express.json());

// Configura las rutas relacionadas con la autenticación de usuarios.
app.use("/api/auth", authRoutes);

// Configura el middleware encargado de manejar los errores que ocurran durante la ejecución de la aplicación.
app.use(errorMiddleware);

// Define la ruta principal de la API.
app.get("/", (req, res) => {
  // Devuelve una respuesta en formato JSON indicando que la API está funcionando.
  res.json({
    message: "API de Gestión de Tareas funcionando",
  });
});

// Define una función asíncrona encargada de iniciar el servidor.
const startServer = async (): Promise<void> => {
  try {
    // Comprueba que exista conexión con la base de datos antes de iniciar el servidor.
    await testDatabaseConnection();

    // Inicia el servidor en el puerto configurado en las variables de entorno.
    app.listen(env.port, () => {
      // Muestra en consola la dirección donde se está ejecutando el servidor.
      console.log(
        `Servidor ejecutándose en http://localhost:${env.port}`
      );
    });
  } catch (error) {
    // Muestra un mensaje de error si la aplicación no puede iniciar correctamente.
    console.error("No fue posible iniciar la aplicación");

    // Finaliza el proceso de Node.js indicando que ocurrió un error.
    process.exit(1);
  }
};

// Ejecuta la función encargada de iniciar el servidor.
startServer();