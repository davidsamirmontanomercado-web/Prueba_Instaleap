// Importa Router desde Express para crear y organizar las rutas de la API.
import { Router } from "express";

// Importa el controlador encargado de realizar el registro de usuarios.
import { register, login } from "../../controllers/auth.controller";

// Importa el middleware de autenticación y la interfaz AuthenticatedRequest desde el archivo auth.middleware.ts.
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";

// Crea una instancia del router de Express.
const router = Router();

// Define una ruta POST para registrar un nuevo usuario.
// Cuando se realiza una petición POST a "/register", se ejecuta el controlador register.
router.post("/register", register);

router.post("/login", login)


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

// Exporta el router para poder utilizarlo en otras partes de la aplicación.
export default router;