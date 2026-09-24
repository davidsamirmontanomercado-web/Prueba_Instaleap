// Importa swagger-jsdoc, encargado de generar la especificación OpenAPI
// a partir de la configuración y los comentarios JSDoc.
import swaggerJSDoc from "swagger-jsdoc";

// Configuración principal de OpenAPI.
const swaggerDefinition = {
  // Versión de la especificación OpenAPI utilizada.
  openapi: "3.0.0",

  // Información general de la API.
  info: {
    title: "API de Gestión de Tareas",
    version: "1.0.0",
    description:
      "API RESTful para autenticación y gestión de tareas.",
  },

  // Servidores disponibles para realizar las peticiones.
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],

  // Categorías que Swagger utilizará para organizar los endpoints.
  tags: [
    {
      name: "Auth",
      description: "Autenticación y gestión de usuarios",
    },
    {
      name: "Tasks",
      description: "Gestión de tareas",
    },
  ],

  // Configuración de los mecanismos de autenticación.
  components: {
    securitySchemes: {
      // Nombre que utilizaremos para identificar la autenticación JWT.
      bearerAuth: {
        // Indica que utilizamos el mecanismo de autenticación HTTP.
        type: "http",

        // Indica que el token se enviará utilizando Bearer.
        scheme: "bearer",

        // Indica que el Bearer Token corresponde a un JWT.
        bearerFormat: "JWT",
      },
    },
  },
};

// Genera la especificación OpenAPI utilizando la configuración anterior
// y los comentarios JSDoc existentes en las rutas.
export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,

  // Indica dónde buscar los comentarios JSDoc de Swagger.
  apis: [
    "./src/api/routes/*.ts",
  ],
});