# Development Log

## 1. Uso de asistentes de IA

Durante el desarrollo del proyecto se utilizó un asistente de inteligencia artificial como herramienta de apoyo técnico.

El uso de IA se enfocó principalmente en comprender conceptos, revisar código, identificar posibles errores y proponer alternativas de implementación. Las decisiones finales fueron revisadas y probadas dentro del proyecto antes de ser incorporadas.

### 1.1 Prompt: estructura inicial del proyecto

**Prompt utilizado:**

> Estoy desarrollando una API REST con Node.js, Express, TypeScript y PostgreSQL. La prueba técnica requiere una estructura organizada en capas con api, controllers, services y persistence. ¿Qué dependencias iniciales debería instalar y para qué sirve cada una?

**Qué se aceptó y por qué:**

Se tomó como referencia la propuesta de organización por capas y las dependencias necesarias para desarrollar la API.

La estructura final se organizó de la siguiente manera:

```text
src/
├── api/
│   ├── middlewares/
│   └── routes/
├── config/
├── controllers/
├── errors/
├── persistence/
├── schemas/
├── services/
└── app.ts
```

La decisión se tomó porque permite separar las responsabilidades de la aplicación y facilita su mantenimiento.

**Qué se modificó:**

Las recomendaciones iniciales se adaptaron a los requisitos específicos de la prueba técnica. Se utilizó PostgreSQL como base de datos y se mantuvieron solamente las dependencias necesarias para el proyecto.

**Cómo se verificó:**

Se comprobó que el proyecto compilara correctamente con TypeScript y que las diferentes capas pudieran comunicarse correctamente durante las pruebas de los endpoints.

---

### 1.2 Prompt: autenticación con bcrypt y JWT

**Prompt utilizado:**

> Explícame cómo implementar registro y login utilizando bcrypt para las contraseñas y JWT para la autenticación. Quiero entender qué ocurre durante el registro y durante el login.

**Qué se aceptó y por qué:**

Se utilizó bcrypt para almacenar las contraseñas de forma segura mediante un hash.

Durante el registro:

```text
Contraseña del usuario
        ↓
bcrypt.hash()
        ↓
Hash
        ↓
PostgreSQL
```

Durante el login:

```text
Contraseña proporcionada
        ↓
bcrypt.compare()
        ↓
Hash almacenado
        ↓
Credenciales válidas
```

Después de validar las credenciales se genera un JWT que identifica al usuario autenticado.

**Qué se modificó:**

La implementación se adaptó para que el JWT solamente contenga la información necesaria para identificar al usuario, principalmente `userId` y `email`.

También se estableció una duración de una hora para el token.

**Cómo se verificó:**

Se realizaron pruebas de registro, login con credenciales correctas, login con contraseña incorrecta y acceso a rutas protegidas utilizando el token generado.

---

### 1.3 Prompt: control de acceso a las tareas

**Prompt utilizado:**

> ¿Cómo puedo asegurar que un usuario solamente pueda consultar, actualizar y eliminar sus propias tareas utilizando Node.js, Express y PostgreSQL?

**Qué se aceptó y por qué:**

Se utilizó el `userId` obtenido del JWT autenticado para identificar al propietario de la tarea.

En las consultas SQL se utiliza una condición como:

```sql
WHERE id = $1
  AND user_id = $2
```

Esto permite que una tarea solamente sea encontrada cuando pertenece al usuario autenticado.

**Qué se modificó:**

El `userId` no se recibe desde el cuerpo de la petición para realizar operaciones sobre las tareas. Se obtiene directamente desde:

```ts
req.user!.userId
```

Esto evita que el cliente pueda indicar arbitrariamente otro usuario como propietario.

**Cómo se verificó:**

Se realizaron pruebas utilizando tareas asociadas a diferentes usuarios y se comprobó que un usuario no pudiera consultar, modificar o eliminar tareas pertenecientes a otro usuario.

---

### 1.4 Prompt: validación con AJV

**Prompt utilizado:**

> Explícame cómo implementar validaciones de request body utilizando AJV, JSONSchemaType y TypeScript en una API Express.

**Qué se aceptó y por qué:**

Se implementó un middleware reutilizable:

```ts
validateBody(schema)
```

Este middleware recibe un esquema y valida `req.body` antes de ejecutar el controlador.

Se utilizaron esquemas independientes para autenticación y tareas.

**Cómo se verificó:**

Se probaron peticiones con información válida e inválida, incluyendo correos electrónicos incorrectos, campos obligatorios ausentes y estados de tareas no permitidos.

---

## 2. Decisiones tomadas sin IA

### 2.1 Utilizar arquitectura por capas

Se decidió separar la aplicación en rutas, middlewares, controllers, services y persistence.

La decisión se tomó para mantener responsabilidades independientes:

```text
Routes
   ↓
Middlewares
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

Esto permite que la lógica de negocio no dependa directamente de Express ni de las consultas SQL.

---

### 2.2 Obtener el propietario desde el JWT

Se decidió que el usuario propietario de una tarea no se recibiera desde el body de la petición.

El identificador se obtiene del usuario autenticado:

```ts
const userId = req.user!.userId;
```

La decisión se tomó para evitar que un cliente pudiera modificar el `userId` enviado en la petición y acceder a información de otro usuario.

---

## 3. Retos y soluciones

### 3.1 Separación de responsabilidades

Uno de los retos fue organizar correctamente la lógica de la aplicación.

Se decidió separar:

* Controllers: manejo de HTTP.
* Services: reglas de negocio.
* Repositories: acceso a PostgreSQL.
* Middlewares: autenticación, validación y manejo de errores.

Esto permitió evitar que los controladores tuvieran consultas SQL o lógica de negocio compleja.

---

### 3.2 Autenticación mediante JWT

Otro reto fue implementar correctamente el flujo de autenticación.

El flujo final quedó:

```text
Login
  ↓
Buscar usuario
  ↓
¿Existe?
  ├── No → AuthenticationError
  └── Sí
        ↓
bcrypt.compare()
        ↓
¿Contraseña válida?
  ├── No → AuthenticationError
  └── Sí
        ↓
Generar JWT
        ↓
Devolver token
```

Posteriormente, el middleware verifica el token antes de permitir el acceso a las rutas protegidas.

---

### 3.3 Protección de las tareas por usuario

Se necesitaba garantizar que cada usuario solamente pudiera administrar sus propias tareas.

La solución fue incluir el usuario autenticado directamente en las consultas SQL:

```sql
WHERE id = $1
  AND user_id = $2
```

De esta manera, aunque un usuario conozca el ID de otra tarea, la consulta no devuelve el registro si esa tarea pertenece a otro usuario.

---

### 3.4 Validación de datos

Se necesitaba validar los datos antes de enviarlos a la lógica de negocio.

Se implementó AJV con JSON Schema para validar:

* Email.
* Contraseña.
* Título de la tarea.
* Descripción.
* Fecha de vencimiento.
* Estado de la tarea.

Además, se configuró:

```ts
additionalProperties: false
```

para evitar recibir propiedades que no forman parte del contrato definido para cada endpoint.

---

### 3.5 Manejo centralizado de errores

Se implementaron errores personalizados como:

```text
AppError
AuthenticationError
NotFoundError
```

Los servicios pueden lanzar estos errores y los controladores los envían al middleware mediante:

```ts
next(error);
```

El middleware centralizado determina el código HTTP correspondiente.

Por ejemplo:

```text
AuthenticationError → 401
NotFoundError       → 404
AppError            → código definido
Error desconocido   → 500
```

Esto mantiene respuestas de error consistentes en toda la API.

---

## 4. Verificación del proyecto

La implementación fue verificada mediante pruebas de los endpoints utilizando Swagger y Postman.

Se verificaron principalmente:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

También se verificaron escenarios de error relacionados con autenticación, validación y acceso a tareas.

La documentación de la API se encuentra disponible mediante Swagger durante la ejecución local:

```text
http://localhost:3000/api-docs
```

## 5. Control de versiones

El proyecto utiliza Git y commits siguiendo la convención Conventional Commits.

Ejemplos:

```text
feat: configurar conexion con PostgreSQL
feat: agregar registro de usuario y login
feat: implementar CRUD de tareas
feat: agregar validaciones con ajv
feat: integrar swagger y documentar la api
docs: Terminar la documentacion jsdoc
```

Esto permite identificar de forma clara qué funcionalidad o documentación fue agregada en cada etapa del desarrollo.
