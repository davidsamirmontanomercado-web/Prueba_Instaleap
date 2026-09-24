
## 1. Descripción del proyecto y arquitectura

API RESTful desarrollada utilizando la seguientes tecnologias **Node.js, PosTman Express, TypeScript y PostgreSQL** para la gestión de usuarios y tareas.
La funciones de proyecto se desarrollo teniendo en cuanta la siguientes tablas

<img width="1085" height="261" alt="image" src="https://github.com/user-attachments/assets/11079f55-7551-422d-802b-b13b30f396a3" />

<img width="1085" height="263" alt="image" src="https://github.com/user-attachments/assets/2b4634d6-46de-4c44-9959-61e252f9c759" />




### Arquitectura

El proyecto utiliza una **arquitectura por capas**, separando las responsabilidades de cada componente:

```text
src/
├── api/
│   ├── middlewares/
│   └── routes/
├── config/
├── controllers/
├── database/
├── errors/
├── persistence/
├── schemas/
├── services/
└── app.ts
```

Flujo principal de una petición:

```text
Cliente
   ↓
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

### Responsabilidad de cada capa

* **Routes:** define los endpoints disponibles y dirige las peticiones.
* **Middlewares:** validan la petición, autentican al usuario y gestionan errores.
* **Controllers:** reciben la petición HTTP y construyen la respuesta.
* **Services:** contienen la lógica de negocio.
* **Persistence:** se encarga del acceso a PostgreSQL.
* **Schemas:** definen y validan la estructura de los datos recibidos.
* **Errors:** contiene las excepciones personalizadas de la aplicación.
* **Config:** contiene la configuración de variables de entorno y Swagger.
* **app.ts:** configura la aplicación Express e inicia el servidor.

## 2. Instalación local

### Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

* Node.js
* npm
* PostgreSQL

### Clonar el repositorio

```bash
git clone <https://github.com/davidsamirmontanomercado-web/Prueba_Instaleap.git>
```

Ingresar al proyecto:

```bash
cd Prueba_Instaleap
```

### Instalar dependencias

Ejecutar:

```bash
npm install
```

## 3. Configuración del archivo `.env`

Crear un archivo `.env` en la raíz del proyecto.

Utilizar `.env.example` como referencia:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_la_base_de_datos
DB_USER=usuario_postgresql
DB_PASSWORD=contraseña_postgresql

JWT_SECRET=clave_secreta_para_jwt
```

### Descripción de las variables

| Variable      | Descripción                                             |
| ------------- | ------------------------------------------------------- |
| `PORT`        | Puerto donde se ejecutará la API.                       |
| `DB_HOST`     | Host del servidor PostgreSQL.                           |
| `DB_PORT`     | Puerto utilizado por PostgreSQL.                        |
| `DB_NAME`     | Nombre de la base de datos.                             |
| `DB_USER`     | Usuario de PostgreSQL.                                  |
| `DB_PASSWORD` | Contraseña del usuario de PostgreSQL.                   |
| `JWT_SECRET`  | Clave utilizada para firmar y verificar los tokens JWT. |

Además, se debe crear la base de datos PostgreSQL y ejecutar el script:

```text
database/schema.sql
```
Este archivo contiene la estructura de las tablas necesarias para el funcionamiento de la aplicación.

## 4. Ejecución del proyecto

Una vez instaladas las dependencias y configurado el archivo `.env`, ejecutar:

```bash
npm run dev
```

La aplicación se iniciará en:

```text
http://localhost:3000
```

La documentación de la API mediante Swagger estará disponible en:

```text
http://localhost:3000/api-docs
```
