import { Request, Response, NextFunction } from "express";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

// Controlador encargado del registro de usuarios.
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