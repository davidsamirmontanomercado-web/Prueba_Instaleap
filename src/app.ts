import express from "express";
import { env } from "./config/env";
import { testDatabaseConnection } from "./persistence/database";
import { errorMiddleware } from "./api/middlewares/error.middleware";
import authRoutes from "./api/routes/auth.routes";
import tasksRoutes from "./api/routes/tasks.routes";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();
// app-use
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", tasksRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.json({
    message: "API de Gestión de Tareas funcionando",
  });
});

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  try { 
    await testDatabaseConnection();
    app.listen(env.port, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("No fue posible iniciar la aplicación");

    process.exit(1);
  }
};

startServer();