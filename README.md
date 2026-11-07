# Julie API

API RESTful para la tienda online ficticia **Julie**. Permite gestionar categorías, productos y usuarios, con autenticación mediante JWT y rutas protegidas por rol. Proyecto final de Backend.

- **API en producción:** https://julie-api.vercel.app
- **Repositorio:** https://github.com/Valeria-s-v/julie-api

## Esquema de la base de datos

Base de datos **MongoDB** (alojada en MongoDB Atlas), base `julie`, con tres colecciones.

### `categories`

| Campo                 | Tipo   | Detalle            |
| --------------------- | ------ | ------------------ |
| name                  | String | Obligatorio, único |
| description           | String | Opcional           |
| createdAt / updatedAt | Date   | Automáticos        |

### `products`

| Campo                 | Tipo     | Detalle                                 |
| --------------------- | -------- | --------------------------------------- |
| name                  | String   | Obligatorio                             |
| description           | String   | Opcional                                |
| price                 | Number   | Obligatorio, mínimo 0                   |
| stock                 | Number   | Mínimo 0, por defecto 0                 |
| image                 | String   | URL o ruta de la imagen                 |
| sizes                 | [String] | Talles disponibles                      |
| colors                | [String] | Colores disponibles                     |
| category              | ObjectId | Referencia a `categories` (obligatorio) |
| createdAt / updatedAt | Date     | Automáticos                             |

### `users`

| Campo                 | Tipo   | Detalle                                                      |
| --------------------- | ------ | ------------------------------------------------------------ |
| name                  | String | Obligatorio                                                  |
| email                 | String | Obligatorio, único                                           |
| password              | String | Obligatorio, mínimo 6 caracteres, guardada con hash (bcrypt) |
| role                  | String | `user` (por defecto) o `admin`                               |
| createdAt / updatedAt | Date   | Automáticos                                                  |

## Tecnologías utilizadas

- Node.js y Express 5
- MongoDB Atlas y Mongoose
- JSON Web Token (`jsonwebtoken`) para la autenticación
- bcrypt para el hash de contraseñas
- dotenv para las variables de entorno
- CORS habilitado
- Despliegue en Vercel

## Arquitectura

El proyecto sigue una arquitectura por capas:

```
Ruta -> Middleware -> Controlador -> Servicio -> Modelo -> MongoDB
```

```
julie-api/
├── app.js
├── .env.example
├── package.json
└── src/
    ├── config/         conexión a MongoDB
    ├── models/         esquemas de Mongoose
    ├── services/       lógica de negocio y acceso a datos
    ├── controllers/    manejo de peticiones y respuestas HTTP
    ├── routes/         definición de endpoints
    └── middleware/     verifyToken y verifyAdmin
```

## Instalación y ejecución

Requisitos: Node.js 18 o superior y una base de datos MongoDB (por ejemplo, un cluster gratuito en MongoDB Atlas).

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Valeria-s-v/julie-api.git
   cd julie-api
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz a partir de `.env.example` y completar los valores (ver la sección siguiente).

4. Iniciar el servidor:

   ```bash
   npm run dev     # desarrollo, con reinicio automático (nodemon)
   npm start       # producción
   ```

   El servidor queda disponible en `http://localhost:3000`.

## Variables de entorno

Archivo `.env.example` (reemplazar por valores propios; **nunca subir el `.env` real**):

```
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER.mongodb.net/julie?appName=CLUSTER
JWT_SECRET=una_clave_larga_y_aleatoria_de_30_caracteres_o_mas
```

## Endpoints

Base URL: `https://julie-api.vercel.app` (o `http://localhost:3000` en local).

Las rutas protegidas requieren el encabezado:

```
Authorization: Bearer <token>
```

### Usuarios

| Método | Ruta                  | Acceso  | Descripción                       |
| ------ | --------------------- | ------- | --------------------------------- |
| POST   | `/api/users/register` | Público | Registra un usuario               |
| POST   | `/api/users/login`    | Público | Inicia sesión y devuelve un token |

### Categorías

| Método | Ruta                  | Acceso  | Descripción                                           |
| ------ | --------------------- | ------- | ----------------------------------------------------- |
| GET    | `/api/categories`     | Público | Lista las categorías                                  |
| GET    | `/api/categories/:id` | Público | Obtiene una categoría                                 |
| POST   | `/api/categories`     | Admin   | Crea una categoría                                    |
| DELETE | `/api/categories/:id` | Admin   | Elimina una categoría (no permite si tiene productos) |

### Productos

| Método | Ruta                        | Acceso  | Descripción                            |
| ------ | --------------------------- | ------- | -------------------------------------- |
| GET    | `/api/products`             | Público | Lista los productos (con su categoría) |
| GET    | `/api/products?category=ID` | Público | Filtra por categoría                   |
| GET    | `/api/products/:id`         | Público | Obtiene un producto                    |
| POST   | `/api/products`             | Admin   | Crea un producto                       |
| PUT    | `/api/products/:id`         | Admin   | Actualiza un producto                  |
| DELETE | `/api/products/:id`         | Admin   | Elimina un producto                    |

### Códigos de respuesta

| Código | Significado                                          |
| ------ | ---------------------------------------------------- |
| 200    | Operación correcta                                   |
| 201    | Recurso creado                                       |
| 400    | Datos inválidos o faltantes                          |
| 401    | Sin token, token inválido o credenciales incorrectas |
| 403    | Sin permiso (se requiere rol admin)                  |
| 404    | Recurso no encontrado                                |
| 500    | Error interno del servidor                           |

## Ejemplos de solicitudes (JSON)

### Registro: `POST /api/users/register`

```json
{
  "name": "Valeria",
  "email": "usuario@ejemplo.com",
  "password": "clave1234"
}
```

Respuesta (201):

```json
{
  "id": "6ae7e67dc18a56ff264ca196",
  "name": "Valeria",
  "email": "usuario@ejemplo.com",
  "role": "user"
}
```

### Login: `POST /api/users/login`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "clave1234"
}
```

Respuesta (200):

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

### Crear categoría: `POST /api/categories` (admin)

```json
{
  "name": "Remeras",
  "description": "Remeras de algodón"
}
```

### Crear producto: `POST /api/products` (admin)

```json
{
  "name": "Remera básica",
  "description": "Remera de algodón, corte clásico",
  "price": 12500,
  "stock": 20,
  "image": "/images/remera-basica.jpg",
  "sizes": ["S", "M", "L"],
  "colors": ["blanco", "negro"],
  "category": "ID_DE_UNA_CATEGORIA"
}
```

Respuesta (201): el producto creado, con la categoría incluida (`populate`).

### Actualizar producto: `PUT /api/products/:id` (admin)

```json
{
  "price": 15000,
  "stock": 18
}
```

### Listar productos: `GET /api/products` (sin body)

Respuesta (200):

```json
[
  {
    "_id": "6aebb5c8856a57bdbb1340d9",
    "name": "Remera básica",
    "description": "Remera de algodón, corte clásico",
    "price": 12500,
    "stock": 20,
    "image": "/images/remera-basica.jpg",
    "sizes": ["S", "M", "L"],
    "colors": ["blanco", "negro"],
    "category": {
      "_id": "6ae7e67dc18a56ff264ca196",
      "name": "Remeras",
      "description": "Remeras de algodón"
    }
  }
]
```

### Eliminar un producto: `DELETE /api/products/:id` (admin, sin body)

Respuesta (200):

```json
{ "mensaje": "Producto eliminado correctamente" }
```

> Las solicitudes `GET` y `DELETE` no llevan body. Las rutas de administrador requieren el encabezado `Authorization: Bearer <token>`.

### Errores de ejemplo

Sin token (401):

```json
{ "mensaje": "Acceso denegado: falta el token" }
```

Sin permiso de administrador (403):

```json
{ "mensaje": "Acceso denegado: se requiere rol admin" }
```

Id con formato inválido (400):

```json
{ "mensaje": "ID de categoría inválido" }
```

## Roles y seguridad

- El registro siempre crea usuarios con rol `user`. El rol `admin` se asigna manualmente en la base de datos.
- Las contraseñas se guardan con hash (bcrypt) mediante un hook `pre-save`.
- Los tokens JWT vencen a las 24 horas.
- Las rutas de escritura (crear, actualizar y eliminar) requieren un token de un usuario `admin`.
- Se aceptan solo los campos esperados en cada petición, y el rol nunca se toma del cuerpo del registro.

## Funcionalidades

**Implementadas**

- CRUD de categorías y productos con relación entre ambos (`populate`).
- Filtro de productos por categoría.
- Registro y login de usuarios con JWT.
- Rutas protegidas por rol mediante middleware.
- Capa de servicios con toda la lógica de negocio.
- Validaciones y manejo de errores con códigos HTTP.
- Despliegue en Vercel.

**A futuro**

- Favoritos por usuario.
- Carrito de compras y órdenes.
- Subida de imágenes (por ejemplo, con Cloudinary).
- Paginación y búsqueda de productos.
- Pruebas automatizadas.
