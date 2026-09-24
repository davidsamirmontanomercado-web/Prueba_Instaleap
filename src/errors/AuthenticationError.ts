// Importa la clase AppError, que sirve como clase base para crear errores personalizados.
import { AppError } from "./AppError";

/**
 * Representa un error relacionado con autenticación
 * o autorización.
 */
export class AuthenticationError extends AppError {
  // Constructor de la clase.
  // Si no se proporciona un mensaje, utiliza "No autorizado" como mensaje predeterminado.
  constructor(message = "No autorizado") {

    // Llama al constructor de AppError.
    // Envía el mensaje recibido y el código HTTP 401, que representa "No autorizado".
    super(message, 401);

    // Establece el nombre específico de este tipo de error.
    this.name = "AuthenticationError";

    // Establece correctamente el prototipo para que JavaScript reconozca
    // el objeto como una instancia de AuthenticationError.
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}