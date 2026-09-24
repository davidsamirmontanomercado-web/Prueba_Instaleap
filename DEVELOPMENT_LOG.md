# Uso de Asistentes de IA

Durante el desarrollo del proyecto utilicé un asistente de inteligencia artificial como herramienta de apoyo técnico. Su uso estuvo orientado principalmente a estudiar conceptos, revisar alternativas de implementación, resolver dudas puntuales y generar algunos fragmentos de código.

No se utilizó la IA para generar el proyecto completo. La estructura general, integración de los componentes, configuración del proyecto, pruebas y decisiones de implementación fueron realizadas y revisadas dentro del desarrollo del proyecto.

## 1. Usos significativos de IA

### 1.1 Estudio de dependencias y configuración inicial

**Prompt utilizado:**

> Estoy desarrollando una API REST con Node.js, Express, TypeScript y PostgreSQL. La prueba técnica requiere una estructura organizada en capas con api, controllers, services y persistence. ¿Qué dependencias iniciales debería instalar y para qué sirve cada una?

### Qué se aceptó y por qué

Utilicé la IA principalmente para estudiar las dependencias necesarias y comprender la función de cada una antes de instalarlas.

Se revisaron dependencias relacionadas con:

* Express para construir la API REST.
* TypeScript para tipado estático.
* PostgreSQL mediante `pg`.
* `dotenv` para manejar variables de entorno.
* `bcrypt` para el manejo seguro de contraseñas.
* `jsonwebtoken` para autenticación mediante JWT.
* `AJV` y `ajv-formats` para validar los datos recibidos.
* Swagger para documentar los endpoints de la API.

Después de revisar las opciones, la dependencia que me faltaba para completar la documentación mediante Swagger fue:

```bash
npm install swagger-ui-express yaml
npm install -D @types/swagger-ui-express
```

La instalación de estas dependencias permitió integrar la documentación de la API y visualizar los endpoints mediante Swagger.

### Qué se rechazó o modificó

No incorporé automáticamente todas las dependencias o recomendaciones proporcionadas por la IA.

Primero revisé para qué servía cada dependencia y si realmente era necesaria para los requerimientos de la prueba técnica. Evité agregar librerías que no aportaran una funcionalidad concreta al proyecto.

También adapté las recomendaciones a la estructura que estaba construyendo y mantuve las dependencias limitadas a las necesidades reales de la aplicación.

### Verificación realizada

La instalación y funcionamiento de las dependencias se verificó mediante:

* Instalación con `npm install`.
* Revisión de las dependencias instaladas en `package.json`.
* Ejecución del proyecto mediante `npm run dev`.
* Pruebas de los endpoints de autenticación y tareas.
* Verificación de la documentación en `http://localhost:3000/api-docs`.
* Pruebas de Swagger para comprobar que los endpoints respondieran correctamente.

---

### 1.2 Autenticación con bcrypt y JWT

**Prompt utilizado:**

> Explícame cómo implementar el registro y login de usuarios en Node.js con PostgreSQL, bcrypt y JWT, teniendo en cuenta que las contraseñas no deben almacenarse en texto plano.

### Qué se aceptó y por qué

Utilicé la explicación y algunos fragmentos de código como referencia para implementar el proceso de autenticación.

Se incorporó:

* `bcrypt.hash()` para generar el hash de la contraseña durante el registro.
* `bcrypt.compare()` para verificar la contraseña durante el login.
* `jwt.sign()` para generar el token de autenticación.
* Un middleware para verificar el token recibido mediante `Authorization: Bearer <token>`.

La contraseña original nunca se almacena en la base de datos. Se almacena únicamente el hash generado por bcrypt.

### Qué se rechazó o modificó

No utilicé directamente todo el código generado. Revisé la estructura y adapté la implementación a las capas del proyecto.

También decidí mantener la información incluida en el JWT limitada a los datos necesarios para identificar al usuario, principalmente `userId` y `email`.

### Verificación realizada

Se realizaron pruebas de:

* Registro de usuarios.
* Intento de registrar un correo existente.
* Login con credenciales correctas.
* Login con contraseña incorrecta.
* Acceso a rutas protegidas sin token.
* Acceso con token inválido.
* Acceso con token válido.

---

### 1.3 Control de acceso a las tareas

**Prompt utilizado:**

> ¿Cómo puedo garantizar que un usuario autenticado solamente pueda consultar, actualizar y eliminar sus propias tareas en una API REST con Express, JWT y PostgreSQL?

### Qué se aceptó y por qué

Utilicé la explicación de la IA como referencia para implementar el control de propiedad mediante el `userId` obtenido del JWT.

El `userId` autenticado se envía desde el controlador hacia el servicio y posteriormente al repositorio.

Las consultas SQL utilizan tanto el identificador de la tarea como el identificador del usuario:

```sql
WHERE id = $1
  AND user_id = $2
```

Esto permite que una tarea solamente sea encontrada, modificada o eliminada si pertenece al usuario autenticado.

### Qué se rechazó o modificó

No confié en que el `userId` enviado por el cliente fuera válido. El identificador utilizado para las operaciones protegidas se obtiene del token JWT verificado por el middleware.

Esta decisión evita que un usuario pueda modificar manualmente el identificador de otro usuario para intentar acceder a sus tareas.

### Verificación realizada

Se crearon usuarios diferentes y se comprobó que:

* Cada usuario puede consultar sus propias tareas.
* Un usuario no puede consultar una tarea perteneciente a otro usuario.
* Un usuario no puede modificar una tarea de otro usuario.
* Un usuario no puede eliminar una tarea de otro usuario.

---

### 1.4 Validación de datos con AJV

**Prompt utilizado:**

> ¿Cómo puedo utilizar AJV con TypeScript para validar el body de las peticiones de una API Express y devolver errores claros cuando los datos no cumplen el esquema?

### Qué se aceptó y por qué

Utilicé AJV para implementar la validación de los datos recibidos por la API.

Se crearon esquemas independientes para autenticación y tareas, validando aspectos como:

* Formato del correo electrónico.
* Longitud de la contraseña.
* Longitud del título.
* Estado permitido de una tarea.
* Formato de la fecha.
* Propiedades permitidas en el body.

También se utilizó `ajv-formats` para validar formatos como el correo electrónico y las fechas.

### Qué se rechazó o modificó

No consideré que TypeScript por sí solo fuera suficiente para validar los datos enviados por el cliente.

El tipado de TypeScript ayuda durante el desarrollo, pero las peticiones HTTP llegan en tiempo de ejecución. Por esta razón se agregó AJV para realizar la validación real de los datos recibidos.

### Verificación realizada

Se probaron peticiones válidas e inválidas mediante Swagger y se verificó que la API rechazara correctamente datos como:

* Correos electrónicos con formato incorrecto.
* Contraseñas demasiado cortas.
* Títulos vacíos.
* Estados de tarea no permitidos.
* Propiedades no contempladas por el esquema.

---

## 2. Decisiones tomadas sin asistencia de IA

### 2.1 Arquitectura por capas

Una decisión propia fue organizar el proyecto utilizando una arquitectura por capas:

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

La razón fue separar responsabilidades y evitar colocar toda la lógica dentro de las rutas o controladores.

De esta manera, los controladores se encargan principalmente de la comunicación HTTP, los servicios contienen la lógica de negocio y los repositorios manejan el acceso a PostgreSQL.

### 2.2 Control de propiedad mediante el usuario autenticado

Otra decisión propia fue utilizar el `userId` obtenido del JWT para controlar el acceso a las tareas.

Preferí implementar la restricción directamente en las consultas SQL mediante:

```sql
WHERE id = $1
AND user_id = $2
```

Esto permite que la base de datos participe en la restricción de acceso y evita depender únicamente de validaciones realizadas en el controlador.

### 2.3 Uso de consultas parametrizadas

También decidí utilizar consultas parametrizadas de PostgreSQL:

```sql
WHERE id = $1
```

en lugar de construir las consultas concatenando valores recibidos del cliente.

La finalidad es mantener las consultas estructuradas y reducir el riesgo de inyección SQL.

---

## 3. Retos y soluciones

### Reto 1: Separar correctamente las responsabilidades

Al inicio fue necesario comprender qué responsabilidad debía tener cada capa.

**Solución:** se organizó el proyecto en `routes`, `middlewares`, `controllers`, `services` y `persistence`, evitando concentrar toda la lógica en un solo archivo.

### Reto 2: Implementar autenticación

Fue necesario comprender la diferencia entre contraseña, hash y token.

**Solución:** las contraseñas se almacenan mediante un hash generado con bcrypt y el JWT se utiliza posteriormente para identificar al usuario autenticado.

### Reto 3: Evitar acceso entre usuarios

No era suficiente con comprobar que una tarea existiera.

**Solución:** las operaciones sobre tareas reciben el `userId` del usuario autenticado y las consultas verifican simultáneamente `id` y `user_id`.

### Reto 4: Validar datos recibidos

TypeScript no valida por sí mismo los datos que llegan mediante HTTP.

**Solución:** se incorporó AJV para validar los cuerpos de las peticiones antes de llegar a la lógica de negocio.

### Reto 5: Manejar errores de forma centralizada

Era necesario evitar repetir respuestas de error en cada controlador.

**Solución:** se implementaron errores personalizados como `AuthenticationError` y `NotFoundError`, junto con un middleware centralizado de manejo de errores.

---

## 4. Verificación general

La aplicación fue probada durante el desarrollo mediante Swagger y pruebas manuales de los endpoints.

Se verificaron principalmente:

* Registro de usuarios.
* Login.
* Generación y validación de JWT.
* Protección de rutas.
* Creación de tareas.
* Consulta de tareas.
* Consulta de una tarea específica.
* Actualización de tareas.
* Eliminación de tareas.
* Restricción de acceso entre usuarios.
* Validación de datos.
* Manejo de errores.
* Documentación mediante Swagger.

La documentación de la API se encuentra disponible durante la ejecución local en:

```text
http://localhost:3000/api-docs
```

---

## 5. Uso responsable de IA

La IA fue utilizada como herramienta de apoyo para investigar, comprender conceptos, revisar alternativas y resolver problemas puntuales.

El código incorporado fue revisado, adaptado y probado dentro del proyecto antes de considerarlo terminado. Las decisiones sobre arquitectura, organización del código, seguridad, integración de componentes y validación del funcionamiento fueron evaluadas durante el desarrollo y no se asumió que una respuesta generada por IA fuera correcta automáticamente.
