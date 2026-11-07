import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conectarDB } from './src/config/db.js';
import categoryRoute from './src/routes/categoryRoute.js';
import productRoute from './src/routes/productRoute.js';
import userRoute from './src/routes/userRoute.js';
import helmet from 'helmet';

// Si falta una variable obligatoria, el servidor no arranca y dice cuál es
const faltantes = ['MONGODB_URI', 'JWT_SECRET'].filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}`);
}

const app = express();
// Vercel recibe los pedidos a través de un proxy: así se toma la IP real de cada usuario
app.set('trust proxy', 1);

// Orígenes que pueden usar la API desde un navegador (se configuran en el .env)
const origenesPermitidos = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim());

app.use(helmet());
app.use(cors({ origin: origenesPermitidos }));
app.use(express.json({ limit: '10kb' }));

// Antes de cada pedido se asegura de que haya conexión a la base
app.use(async (req, res, next) => {
  try {
    await conectarDB();
    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al conectar con la base de datos' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'API de Julie funcionando' });
});

app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);

// Solo en tu computadora: Vercel no necesita escuchar un puerto
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  conectarDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error al conectar con MongoDB:', error.message);
      process.exit(1);
    });
}

export default app;