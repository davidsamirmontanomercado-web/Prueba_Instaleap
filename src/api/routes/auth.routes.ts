// Importa Router desde Express para crear un conjunto de rutas relacionadas.
import { Router } from "express";

// Importa los controladores de autenticación.
import {register,login,} from "../../controllers/auth.controller";

// Importa el middleware de autenticación y la interfaz
// que representa una petición con usuario autenticado.
import {authMiddleware,AuthenticatedRequest,} from "../middlewares/auth.middleware";

// Importa el middleware que valida los datos utilizando AJV.
import {validateBody,} from "../middlewares/validation.middleware";

// Importa los schemas que contienen las reglas
// de validación para registro y login.
import {registerSchema,loginSchema,} from "../../schemas/auth.schema";

// Crea una instancia del router de Express.
const router = Router();

// Valida los datos del registro antes de ejecutar el controlador.
router.post("/register",validateBody(registerSchema),register);

// Valida los datos del login antes de ejecutar el controlador.
router.post("/login",validateBody(loginSchema),login);

// Ruta protegida para consultar el usuario autenticado.
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

// Exporta el router para utilizarlo en app.ts.
export default router;