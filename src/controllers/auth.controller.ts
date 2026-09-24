import { Request, Response, NextFunction } from "express";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

/**
 * Registra un nuevo usuario mediante una petición HTTP.
 *
 * Obtiene los datos enviados en el cuerpo de la petición,
 * los envía al servicio de autenticación y devuelve
 * la información del usuario creado.
 *
 * @param req Solicitud HTTP con los datos del usuario.
 * @param res Respuesta HTTP.
 * @param next Middleware utilizado para propagar errores.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;

    const user = await registerUser({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador encargado del inicio de sesión.
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};