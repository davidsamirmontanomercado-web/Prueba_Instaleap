// Importa la clase AppError, que sirve como clase base para crear errores personalizados.
import { AppError } from "./AppError";

/**
 * Representa un error utilizado cuando un recurso
 * solicitado no existe.
 */
export class NotFoundError extends AppError {

  // Constructor de la clase.
  // Si no se proporciona un mensaje, utiliza "Recurso no encontrado" como mensaje predeterminado.
  constructor(message = "Recurso no encontrado") {

    // Llama al constructor de AppError.
    // Envía el mensaje recibido y el código HTTP 404, que representa "Not Found".
    super(message, 404);

    // Establece el nombre específico de este tipo de error.
    this.name = "NotFoundError";

    // Establece correctamente el prototipo para que JavaScript reconozca
    // el objeto como una instancia de NotFoundError.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}