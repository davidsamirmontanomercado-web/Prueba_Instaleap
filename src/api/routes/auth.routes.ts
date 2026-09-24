import { Router } from "express";

import {register,login,} from "../../controllers/auth.controller";

import {authMiddleware,AuthenticatedRequest,} from "../middlewares/auth.middleware";

import {validateBody,} from "../middlewares/validation.middleware";

import {registerSchema,loginSchema,} from "../../schemas/auth.schema";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El correo electrónico ya está registrado
 */
router.post("/register",validateBody(registerSchema),register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y genera un token JWT.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Correo electrónico o contraseña incorrectos
 */
router.post("/login",validateBody(loginSchema),login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     description: Devuelve la información del usuario asociado al token JWT.
 *     tags:
 *       - Auth
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *       401:
 *         description: Token requerido, inválido o expirado
 */
router.get(
  "/me",
  authMiddleware,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      message: "Usuario autenticado correctamente",
      user: req.user,
    });
  }
);

export default router;