import { Request, Response, NextFunction } from "express";
// Importa AJV para validar datos utilizando JSON Schema.
// JSONSchemaType permite tipar el esquema según TypeScript.
// ValidateFunction representa la función que AJV genera
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
// Importa la función que agrega validaciones adicionales
import addFormats from "ajv-formats";

// Crea una instancia de AJV que será utilizada
// para compilar y ejecutar los esquemas de validación.
const ajv = new Ajv({ allErrors: true, });

// Agrega formatos adicionales a AJV.
addFormats(ajv);

/**
 * Crea un middleware para validar el cuerpo de una petición
 * utilizando un esquema JSON de AJV.
 * Declara una función genérica llamada validateBody.
 * <T> permite que la función sea reutilizable
 * 
 * @param schema Esquema utilizado para validar los datos.
 * @returns Middleware de Express encargado de validar req.body.
 */


export const validateBody = <T>(

  // Recibe un JSON Schema que define
  schema: JSONSchemaType<T>

) => {

  // Compila el esquema utilizando AJV.
  //
  const validate: ValidateFunction<T> = ajv.compile(schema);
  // Devuelve un middleware de Express.
  //
  // Esto permite utilizar validateBody() directamente
  // dentro de las rutas.
  return (
    req: Request,
    res: Response,
    next: NextFunction

  ): void => {
    // Valida el contenido de req.body utilizando
    // el esquema que fue recibido anteriormente.
    const valid = validate(req.body);


    // Comprueba si los datos enviados por el cliente
    // no cumplen las reglas definidas en el schema.
    if (!valid) {

      // Devuelve HTTP 400 (Bad Request) porque
      // los datos enviados por el cliente son inválidos.
      res.status(400).json({

        // Mensaje general para indicar que
        // los datos enviados no son correctos.
        error: "Datos de entrada inválidos",

        // Contiene información detallada de los errores
        details: validate.errors,
      });

      return;
    }
    next();
  };
};