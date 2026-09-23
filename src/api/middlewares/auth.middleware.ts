import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthenticationError } from "../../errors/AuthenticationError";
import { env } from "../../config/env";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AuthenticationError(
        "Token de autenticación requerido"
      );
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AuthenticationError(
        "Formato de autorización inválido"
      );
    }

    const decoded = jwt.verify(token, env.jwt.secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string"
    ) {
      throw new AuthenticationError(
        "Token de autenticación inválido"
      );
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }

    next(
      new AuthenticationError(
        "Token de autenticación inválido o expirado"
      )
    );
  }
};