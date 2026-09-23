// Importa los tipos Request, Response y NextFunction desde Express.
import { Request, Response, NextFunction } from "express";

// Importa la clase AppError para identificar los errores personalizados de la aplicación.
import { AppError } from "../../errors/AppError";

// Define el middleware encargado de manejar los errores de la aplicación.
export const errorMiddleware = (
  // Contiene la información del error que ocurrió.
  error: Error,

  // Representa la petición HTTP realizada por el cliente.
  req: Request,

  // Permite enviar una respuesta HTTP al cliente.
  res: Response,

  // Permite pasar el control al siguiente middleware de Express.
  next: NextFunction
): void => {

  // Comprueba si el error recibido es una instancia de AppError.
  if (error instanceof AppError) {

    // Envía el código de estado HTTP definido en el error personalizado.
    res.status(error.statusCode).json({
      // Envía el mensaje asociado al error al cliente.
      error: error.message,
    });

    // Detiene la ejecución porque la respuesta ya fue enviada.
    return;
  }

  // Muestra en la consola los errores que no son errores personalizados.
  console.error(error);

  // Envía un código HTTP 500 para indicar un error interno del servidor.
  res.status(500).json({
    // Envía un mensaje genérico al cliente.
    error: "Error interno del servidor",
  });
};