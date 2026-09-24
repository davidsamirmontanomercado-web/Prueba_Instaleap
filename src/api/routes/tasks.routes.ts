// Importa Router desde Express para crear un conjunto de rutas relacionadas.
import { Router } from "express";

// Importa los controladores que contienen la lógica de cada operación
// relacionada con las tareas.
import {
  createTask, // Crear una nueva tarea.
  deleteTask, // Eliminar una tarea existente.
  getTask,    // Obtener una tarea específica por su ID.
  getTasks,   // Obtener todas las tareas.
  updateTask, // Actualizar una tarea existente.
} from "../../controllers/tasks.controller";

// Importa el middleware que verifica que el usuario esté autenticado
// antes de permitir el acceso a las rutas protegidas.
import { authMiddleware } from "../middlewares/auth.middleware";

// Importa el middleware encargado de validar los datos enviados
// en el cuerpo (body) de las peticiones.
import { validateBody } from "../middlewares/validation.middleware";

// Importa los esquemas de validación para crear y actualizar tareas.
import {
  createTaskSchema, // Define las reglas para crear una tarea.
  updateTaskSchema, // Define las reglas para actualizar una tarea.
} from "../../schemas/tasks.schema";

// Crea una instancia de Router de Express.
const router = Router();

router.post("/",authMiddleware,validateBody(createTaskSchema),createTask);
router.get("/",authMiddleware,getTasks);
router.get("/:id",authMiddleware,getTask);
router.put("/:id",authMiddleware,validateBody(updateTaskSchema),updateTask);
router.delete("/:id",authMiddleware,deleteTask);

export default router;