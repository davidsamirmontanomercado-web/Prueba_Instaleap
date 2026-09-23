// Define una clase personalizada para manejar errores de la aplicación.
export class AppError extends Error {
  // Propiedad que almacena el código de estado HTTP asociado al error.
  public readonly statusCode: number;

  // Constructor de la clase. Recibe el mensaje del error y el código de estado HTTP.
  constructor(message: string, statusCode: number) {
    // Llama al constructor de la clase Error y establece el mensaje del error.
    super(message);

    // Define el nombre del error como "AppError".
    this.name = "AppError";

    // Guarda el código de estado HTTP recibido en la propiedad statusCode.
    this.statusCode = statusCode;

    // Establece correctamente la cadena de prototipos para que AppError sea reconocido como una instancia de esta clase.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}