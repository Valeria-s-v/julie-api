import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conectarDB } from './src/config/db.js';
import categoryRoute from './src/routes/categoryRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'API de Julie funcionando' });
});

app.use('/api/categories', categoryRoute);

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});



