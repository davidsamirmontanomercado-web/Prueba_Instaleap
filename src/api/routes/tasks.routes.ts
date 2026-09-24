import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../../controllers/tasks.controller";

import {authMiddleware,} from "../middlewares/auth.middleware";

import {validateBody,} from "../middlewares/validation.middleware";

import {createTaskSchema,updateTaskSchema,} from "../../schemas/tasks.schema";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una tarea
 *     description: Crea una nueva tarea asociada al usuario autenticado.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: Aprender Node.js
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 1000
 *                 example: Estudiar Express y TypeScript
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: 2026-09-30
 *               estado:
 *                 type: string
 *                 enum:
 *                   - pendiente
 *                   - en curso
 *                   - completada
 *                 example: pendiente
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token de autenticación requerido o inválido
 */
router.post("/",authMiddleware,validateBody(createTaskSchema),createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas del usuario
 *     description: Devuelve únicamente las tareas pertenecientes al usuario autenticado.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida correctamente
 *       401:
 *         description: Token de autenticación requerido o inválido
 */
router.get("/",authMiddleware,getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     description: Obtiene una tarea perteneciente al usuario autenticado.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tarea obtenida correctamente
 *       400:
 *         description: ID de tarea inválido
 *       401:
 *         description: Token de autenticación requerido o inválido
 *       404:
 *         description: Tarea no encontrada
 */
router.get("/:id",authMiddleware,getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     description: Actualiza una tarea perteneciente al usuario autenticado.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - estado
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: Aprender Node.js avanzado
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 1000
 *                 example: Estudiar arquitectura por capas
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: 2026-10-01
 *               estado:
 *                 type: string
 *                 enum:
 *                   - pendiente
 *                   - en curso
 *                   - completada
 *                 example: en curso
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       400:
 *         description: Datos de entrada o ID inválidos
 *       401:
 *         description: Token de autenticación requerido o inválido
 *       404:
 *         description: Tarea no encontrada
 */
router.put("/:id",authMiddleware,validateBody(updateTaskSchema),updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     description: Elimina una tarea perteneciente al usuario autenticado.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       400:
 *         description: ID de tarea inválido
 *       401:
 *         description: Token de autenticación requerido o inválido
 *       404:
 *         description: Tarea no encontrada
 */
router.delete("/:id",authMiddleware,deleteTask);

export default router;