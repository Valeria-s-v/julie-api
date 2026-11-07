<div align="center">

# 🛍️ Julie API

**API RESTful de la tienda online Julie: catálogo de moda con autenticación JWT y roles.**

Proyecto final del Curso de Backend Developer

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Mongoose](https://img.shields.io/badge/Mongoose-9-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://julie-api.vercel.app)

🌐 **[API en producción](https://julie-api.vercel.app)** · 🛒 **[Front que la consume](https://github.com/Valeria-s-v/jolie-ecommerce-fullstack)**

</div>

---

## 📑 Contenido

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Esquema de la base de datos](#-esquema-de-la-base-de-datos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Variables de entorno](#-variables-de-entorno)
- [Endpoints](#-endpoints)
- [Ejemplos de solicitudes (JSON)](#-ejemplos-de-solicitudes-json)
- [Seguridad](#-seguridad)
- [Funcionalidades](#-funcionalidades)

---

## ✨ Sobre el proyecto

**Julie** es una tienda online ficticia de ropa y accesorios. Esta API gestiona su catálogo: **categorías**, **productos** relacionados con su categoría y **usuarios** con registro, login y roles.

- 🔓 Cualquier visitante puede **ver** el catálogo.
- 🔐 Solo un usuario **admin** puede **crear, editar y eliminar**.
- 🧱 Arquitectura por capas, con toda la lógica de negocio en `services/`.
- 🚀 Publicada en Vercel y consumida por un front en React.

---

## 🛠️ Tecnologías

| Área              | Herramienta                                  |
| ----------------- | -------------------------------------------- |
| Entorno           | Node.js (ES Modules)                         |
| Servidor          | Express 5                                    |
| Base de datos     | MongoDB Atlas + Mongoose                     |
| Autenticación     | JSON Web Token (`jsonwebtoken`)              |
| Contraseñas       | `bcrypt` (hook `pre-save`)                   |
| Seguridad         | `helmet`, `cors`, `express-rate-limit`       |
| Configuración     | `dotenv`                                     |
| Desarrollo        | `nodemon`                                    |
| Despliegue        | Vercel                                       |

---

## 🧱 Arquitectura

Cada pedido recorre las capas en orden. Los controladores son livianos: solo manejan HTTP y delegan en los servicios.

```mermaid
flowchart LR
    A[Cliente] --> B[Ruta]
    B --> C[Middleware<br/>verifyToken · verifyAdmin]
    C --> D[Controlador<br/>HTTP]
    D --> E[Servicio<br/>lógica de negocio]
    E --> F[Modelo<br/>Mongoose]
    F --> G[(MongoDB Atlas)]
```

```
julie-api/
├── app.js                  Punto de entrada (Express, CORS, helmet, rutas)
├── .env.example            Variables de entorno de ejemplo
├── package.json
├── scripts/
│   ├── seed.js             Carga categorías y productos iniciales
│   ├── seed-data.json      Datos del seed (sin usuarios)
│   └── makeAdmin.js        Asigna el rol admin a un usuario
└── src/
    ├── config/             db.js: conexión a MongoDB (reutilizable)
    ├── models/             productModel · categoryModel · userModel
    ├── services/           productService · categoryService · userService
    ├── controllers/        productController · categoryController · userController
    ├── routes/             productRoute · categoryRoute · userRoute
    └── middleware/         verifyToken.js (verifyToken y verifyAdmin)
```

---

## 🗄️ Esquema de la base de datos

Base **`julie`** en MongoDB Atlas, con tres colecciones. Cada **producto referencia a una categoría**, y las lecturas de productos usan `populate` para traerla completa.

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : "tiene"
    CATEGORIES {
        ObjectId _id
        String name "único"
        String description
    }
    PRODUCTS {
        ObjectId _id
        String name
        Number price
        Number stock
        Boolean highlighted
        ObjectId category "ref"
    }
    USERS {
        ObjectId _id
        String name
        String email "único"
        String password "hash bcrypt"
        String role "user | admin"
    }
```

### `categories`

| Campo                 | Tipo   | Detalle            |
| --------------------- | ------ | ------------------ |
| name                  | String | Obligatorio, único |
| description           | String | Opcional           |
| createdAt / updatedAt | Date   | Automáticos        |

### `products`

| Campo                 | Tipo     | Detalle                                         |
| --------------------- | -------- | ----------------------------------------------- |
| name                  | String   | Obligatorio                                     |
| description           | String   | Opcional                                        |
| price                 | Number   | Obligatorio, mínimo 0                           |
| stock                 | Number   | Mínimo 0, por defecto 0                         |
| image                 | String   | URL de la imagen                                |
| sizes                 | [String] | Talles disponibles                              |
| colors                | [String] | Colores disponibles                             |
| highlighted           | Boolean  | Producto destacado, por defecto `false`         |
| category              | ObjectId | Referencia a `categories` (obligatorio)         |
| createdAt / updatedAt | Date     | Automáticos                                     |

### `users`

| Campo                 | Tipo   | Detalle                                                      |
| --------------------- | ------ | ------------------------------------------------------------ |
| name                  | String | Obligatorio                                                  |
| email                 | String | Obligatorio, único, en minúsculas                            |
| password              | String | Obligatorio, mínimo 6 caracteres, guardada con hash (bcrypt) |
| role                  | String | `user` (por defecto) o `admin`                               |
| createdAt / updatedAt | Date   | Automáticos                                                  |

---

## 🚀 Instalación y ejecución

> Requisitos: **Node.js 18+** y una base de datos **MongoDB** (por ejemplo, un cluster gratuito en MongoDB Atlas).

**1. Clonar el repositorio**

```bash
git clone https://github.com/Valeria-s-v/julie-api.git
cd julie-api
```

**2. Instalar las dependencias**

```bash
npm install
```

**3. Configurar el entorno**: crear un archivo `.env` a partir de `.env.example` y completar los valores ([ver variables](#-variables-de-entorno)).

**4. Cargar los datos iniciales** (10 categorías y 50 productos)

```bash
npm run seed
```

**5. Iniciar el servidor**

```bash
npm run dev     # desarrollo, con reinicio automático
npm start       # producción
```

El servidor queda en **http://localhost:3000**.

**6. (Opcional) Crear un admin**: registrar un usuario con `POST /api/users/register` y después:

```bash
npm run make-admin -- email@ejemplo.com
```

### 📜 Scripts disponibles

| Comando                        | Qué hace                                               |
| ------------------------------ | ------------------------------------------------------ |
| `npm run dev`                  | Inicia el servidor con nodemon                         |
| `npm start`                    | Inicia el servidor                                     |
| `npm run seed`                 | Carga o actualiza categorías y productos (no duplica)  |
| `npm run make-admin -- <email>` | Asigna el rol `admin` a un usuario existente           |

---

## 🔑 Variables de entorno

Archivo `.env.example` (reemplazar por valores propios; **el `.env` real nunca se sube al repositorio**):

```env
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER.mongodb.net/julie?appName=CLUSTER
JWT_SECRET=una_clave_larga_y_aleatoria_de_30_caracteres_o_mas
CORS_ORIGIN=http://localhost:5173
```

| Variable      | Obligatoria | Descripción                                                          |
| ------------- | :---------: | -------------------------------------------------------------------- |
| `PORT`        |     No      | Puerto local (por defecto 3000)                                      |
| `MONGODB_URI` |     Sí      | Cadena de conexión a MongoDB                                         |
| `JWT_SECRET`  |     Sí      | Clave para firmar los tokens                                         |
| `CORS_ORIGIN` |     No      | Orígenes permitidos separados por comas (por defecto `localhost:5173`) |

> Si falta una variable obligatoria, el servidor no arranca y avisa cuál es.

---

## 📡 Endpoints

**Base URL:** `https://julie-api.vercel.app` (o `http://localhost:3000` en local)

Las rutas de admin requieren el encabezado:

```http
Authorization: Bearer <token>
```

### 👤 Usuarios

| Método | Ruta                  | Acceso     | Descripción                       |
| :----: | --------------------- | :--------: | --------------------------------- |
| `POST` | `/api/users/register` | 🔓 Público | Registra un usuario               |
| `POST` | `/api/users/login`    | 🔓 Público | Inicia sesión y devuelve un token |

### 🏷️ Categorías

|  Método  | Ruta                  | Acceso     | Descripción                                         |
| :------: | --------------------- | :--------: | --------------------------------------------------- |
|  `GET`   | `/api/categories`     | 🔓 Público | Lista las categorías                                |
|  `GET`   | `/api/categories/:id` | 🔓 Público | Obtiene una categoría                               |
|  `POST`  | `/api/categories`     | 🔐 Admin   | Crea una categoría                                  |
| `DELETE` | `/api/categories/:id` | 🔐 Admin   | Elimina una categoría (no permite si tiene productos) |

### 👗 Productos

|  Método  | Ruta                        | Acceso     | Descripción                            |
| :------: | --------------------------- | :--------: | -------------------------------------- |
|  `GET`   | `/api/products`             | 🔓 Público | Lista los productos (con su categoría) |
|  `GET`   | `/api/products?category=ID` | 🔓 Público | Filtra por categoría                   |
|  `GET`   | `/api/products/:id`         | 🔓 Público | Obtiene un producto                    |
|  `POST`  | `/api/products`             | 🔐 Admin   | Crea un producto                       |
|  `PUT`   | `/api/products/:id`         | 🔐 Admin   | Actualiza un producto                  |
| `DELETE` | `/api/products/:id`         | 🔐 Admin   | Elimina un producto                    |

### 🚦 Códigos de respuesta

| Código | Significado                                          |
| :----: | ---------------------------------------------------- |
| `200`  | Operación correcta                                   |
| `201`  | Recurso creado                                       |
| `400`  | Datos inválidos o faltantes                          |
| `401`  | Sin token, token inválido o credenciales incorrectas |
| `403`  | Sin permiso (se requiere rol admin)                  |
| `404`  | Recurso no encontrado                                |
| `429`  | Demasiados intentos de login o registro              |
| `500`  | Error interno del servidor                           |

---

## 🧪 Ejemplos de solicitudes (JSON)

> Las solicitudes `GET` y `DELETE` no llevan body. Todos los errores responden con el formato `{ "mensaje": "..." }`.

### 👤 Usuarios

<details>
<summary><b>POST</b> <code>/api/users/register</code>: registrar un usuario</summary>

```json
{
  "name": "Valeria",
  "email": "usuario@ejemplo.com",
  "password": "clave1234"
}
```

Respuesta `201`:

```json
{
  "id": "6ae7e67dc18a56ff264ca196",
  "name": "Valeria",
  "email": "usuario@ejemplo.com",
  "role": "user"
}
```

</details>

<details>
<summary><b>POST</b> <code>/api/users/login</code>: iniciar sesión</summary>

```json
{
  "email": "usuario@ejemplo.com",
  "password": "clave1234"
}
```

Respuesta `200`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "6ae7e67dc18a56ff264ca196",
    "name": "Valeria",
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```

</details>

### 🏷️ Categorías

<details>
<summary><b>GET</b> <code>/api/categories</code>: listar categorías</summary>

Respuesta `200`:

```json
[
  {
    "_id": "6aef6506c391f35611a4b35f",
    "name": "vestidos",
    "description": ""
  },
  {
    "_id": "6aef6506c391f35611a4b360",
    "name": "blusas",
    "description": ""
  }
]
```

</details>

<details>
<summary><b>GET</b> <code>/api/categories/:id</code>: obtener una categoría</summary>

Respuesta `200`:

```json
{
  "_id": "6aef6506c391f35611a4b35f",
  "name": "vestidos",
  "description": ""
}
```

</details>

<details>
<summary><b>POST</b> <code>/api/categories</code>: crear una categoría 🔐</summary>

```json
{
  "name": "trajes de baño",
  "description": "Mallas y bikinis"
}
```

Respuesta `201`: la categoría creada.

</details>

<details>
<summary><b>DELETE</b> <code>/api/categories/:id</code>: eliminar una categoría 🔐</summary>

Respuesta `200`:

```json
{ "mensaje": "Categoría eliminada correctamente" }
```

Si tiene productos asociados, `400`:

```json
{ "mensaje": "No se puede eliminar: la categoría tiene productos asociados" }
```

</details>

### 👗 Productos

<details>
<summary><b>GET</b> <code>/api/products</code>: listar productos</summary>

Respuesta `200` (la categoría viene completa gracias a `populate`):

```json
[
  {
    "_id": "6aef6507c391f35611a4b369",
    "name": "Vestido Floral Midi",
    "description": "Vestido midi con estampado floral y cintura marcada.",
    "price": 52000,
    "stock": 9,
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300",
    "sizes": [],
    "colors": [],
    "highlighted": true,
    "category": {
      "_id": "6aef6506c391f35611a4b35f",
      "name": "vestidos",
      "description": ""
    }
  }
]
```

</details>

<details>
<summary><b>GET</b> <code>/api/products?category=ID</code>: filtrar por categoría</summary>

Ejemplo: `/api/products?category=6aef6506c391f35611a4b35f`

Respuesta `200`: solo los productos de esa categoría, con el mismo formato que el listado.

</details>

<details>
<summary><b>GET</b> <code>/api/products/:id</code>: obtener un producto</summary>

Respuesta `200`: el producto con su categoría. Si no existe, `404`:

```json
{ "mensaje": "Producto no encontrado" }
```

</details>

<details>
<summary><b>POST</b> <code>/api/products</code>: crear un producto 🔐</summary>

```json
{
  "name": "Remera básica",
  "description": "Remera de algodón, corte clásico",
  "price": 12500,
  "stock": 20,
  "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
  "sizes": ["S", "M", "L"],
  "colors": ["blanco", "negro"],
  "highlighted": false,
  "category": "6aef6506c391f35611a4b361"
}
```

Respuesta `201`: el producto creado, con la categoría incluida.

</details>

<details>
<summary><b>PUT</b> <code>/api/products/:id</code>: actualizar un producto 🔐</summary>

Se envían solo los campos a cambiar:

```json
{
  "price": 15000,
  "stock": 18,
  "highlighted": true
}
```

Respuesta `200`: el producto actualizado.

</details>

<details>
<summary><b>DELETE</b> <code>/api/products/:id</code>: eliminar un producto 🔐</summary>

Respuesta `200`:

```json
{ "mensaje": "Producto eliminado correctamente" }
```

</details>

### ⚠️ Errores de ejemplo

| Caso                          | Código | Respuesta                                                     |
| ----------------------------- | :----: | ------------------------------------------------------------- |
| Sin token                     | `401`  | `{ "mensaje": "Acceso denegado: falta el token" }`            |
| Token vencido o alterado      | `401`  | `{ "mensaje": "Token inválido o vencido" }`                   |
| Usuario sin rol admin         | `403`  | `{ "mensaje": "Acceso denegado: se requiere rol admin" }`     |
| Id con formato inválido       | `400`  | `{ "mensaje": "ID de producto inválido" }`                    |
| Email o contraseña incorrecta | `401`  | `{ "mensaje": "Credenciales inválidas" }`                     |
| Muchos intentos fallidos      | `429`  | `{ "mensaje": "Demasiados intentos. Probá de nuevo en 15 minutos." }` |

---

## 🛡️ Seguridad

- 🔒 **Contraseñas con hash** (bcrypt) mediante un hook `pre-save` de Mongoose. Nunca se devuelven en las respuestas (`select: false`).
- 🎟️ **JWT** con el id y el rol del usuario, con vencimiento de 24 horas.
- 👑 **Roles**: el registro siempre crea usuarios `user`. El rol `admin` solo se asigna desde el servidor con `npm run make-admin`.
- 🧹 **Lista blanca de campos**: solo se aceptan los campos esperados en cada petición, y el rol nunca se toma del body.
- 🚦 **Límite de intentos**: máximo 5 intentos fallidos de login o registro cada 15 minutos por IP (`express-rate-limit`).
- 🌐 **CORS restringido** a los orígenes configurados en `CORS_ORIGIN`.
- 🪖 **Cabeceras de seguridad** con `helmet` y body JSON limitado a 10 kb.
- 🕵️ **Mensajes genéricos** en el login: no se revela si falló el email o la contraseña.
- 🔑 **Secretos fuera del código**: todo lo sensible vive en variables de entorno.

---

## ✅ Funcionalidades

**Implementadas**

- [x] CRUD completo de productos y GET / POST / DELETE de categorías
- [x] Relación producto → categoría con `populate`
- [x] Filtro de productos por categoría
- [x] Productos destacados (`highlighted`)
- [x] Registro y login con JWT
- [x] Rutas protegidas por rol con middleware
- [x] Capa de servicios con toda la lógica de negocio
- [x] Validaciones y manejo de errores con códigos HTTP
- [x] Script de seed y script para crear admins
- [x] Protecciones de seguridad para producción
- [x] Despliegue en Vercel y front en React que la consume

**A futuro**

- [ ] Carrito de compras y órdenes
- [ ] Favoritos por usuario
- [ ] Subida de imágenes (por ejemplo, con Cloudinary)
- [ ] Paginación y búsqueda de productos
- [ ] Pruebas automatizadas

---

<div align="center">

Hecho con 💜 por **Valeria Villegas**

</div>