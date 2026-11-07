import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conectarDB } from './src/config/db.js';
import categoryRoute from './src/routes/categoryRoute.js';
import productRoute from './src/routes/productRoute.js';
import userRoute from './src/routes/userRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

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