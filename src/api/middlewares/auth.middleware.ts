// Importa los tipos de Express necesarios para trabajar
import { Request, Response, NextFunction } from "express";

// Importa jsonwebtoken para verificar los tokens JWT.
import jwt from "jsonwebtoken";
// Importa el error personalizado 
import { AuthenticationError } from "../../errors/AuthenticationError";

import { env } from "../../config/env";

// Extiende la interfaz Request de Express para agregar
// información del usuario autenticado a la petición.
export interface AuthenticatedRequest extends Request {

  // user será agregado después de verificar correctamente el token.
  user?: {
    // Identificador del usuario autenticado.
    userId: number;
    // Correo electrónico del usuario autenticado.
    email: string;
  };
}

// Middleware encargado de verificar la autenticación del usuario.
export const authMiddleware = (
  // Se utiliza AuthenticatedRequest para poder agregar req.user.
  req: AuthenticatedRequest,
  // Representa la respuesta HTTP.
  res: Response,
  // Función que permite continuar con el siguiente middleware
  // o con el controlador correspondiente.
  next: NextFunction

// Este middleware no devuelve directamente una respuesta,
// por eso se especifica void.
): void => {

  try {
    const authorization = req.headers.authorization; // Verifica si la petición contiene el header Authorization.
    if (!authorization) {
      throw new AuthenticationError(
        "Token de autenticación requerido"
      );
    }

    // Separa el tipo de autorización y el token.
    const [type, token] = authorization.split(" ");


    // Si alguna de las condiciones falla,
    // el formato de autorización se considera inválido.
    if (type !== "Bearer" || !token) { // valida que el tipo sea "Bearer" y que exista un token
      throw new AuthenticationError(
        "Formato de autorización inválido"
      );
    }

    // env.jwt.secret contiene el secreto utilizado
    // para validar el token.
    const decoded = jwt.verify(token, env.jwt.secret);

    // Verifica que la información contenida dentro del token
    // tenga la estructura esperada.
    if (
      typeof decoded !== "object" || // decoded debe ser un objeto.
      decoded === null ||  // decoded no puede ser null.
      typeof decoded.userId !== "number" ||  // userId debe ser un número.
      typeof decoded.email !== "string"   // email debe ser un string.
    ) {
      // Si el contenido del token no tiene la estructura
      // esperada, se considera un token inválido.
      throw new AuthenticationError(
        "Token de autenticación inválido"
      );
    }
    // Guarda la información del usuario autenticado
    // dentro del objeto request.
    req.user = {
      // Guarda el ID del usuario obtenido del JWT.
      userId: decoded.userId,

      // Guarda el email del usuario obtenido del JWT.
      email: decoded.email,
    };

    // Permite que la petición continúe hacia
    // el siguiente middleware o controlador.
    next();

  } catch (error) {

    // Comprueba si el error ya es un AuthenticationError.
    if (error instanceof AuthenticationError) {
      // Envía el error al middleware global de manejo de errores.
      next(error);

      return;
    }

    // Se transforma en un AuthenticationError
    next(
      new AuthenticationError(
        "Token de autenticación inválido o expirado"
      )
    );
  }
};