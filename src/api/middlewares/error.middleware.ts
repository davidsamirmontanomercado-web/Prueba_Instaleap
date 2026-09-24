import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";


/**
 * Middleware centralizado para manejar los errores
 * generados durante el procesamiento de las peticiones.
 *
 * Los errores de tipo AppError utilizan el código HTTP
 * definido en la propia excepción. Los errores no controlados
 * devuelven una respuesta 500.
 *
 * @param error Error generado durante la petición.
 * @param req Solicitud HTTP.
 * @param res Respuesta HTTP.
 * @param next Middleware siguiente.
 */
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
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