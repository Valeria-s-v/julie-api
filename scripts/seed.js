// Carga las categorías y los productos iniciales en la base de datos.
// Uso: npm run seed
// Se puede correr varias veces: si un dato ya existe, lo actualiza en vez de duplicarlo.
import 'dotenv/config';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import Category from '../src/models/categoryModel.js';
import Product from '../src/models/productModel.js';

const archivo = new URL('./seed-data.json', import.meta.url);
const datos = JSON.parse(await readFile(archivo, 'utf-8'));

const cargarDatos = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  // 1) Categorías: se guarda el _id de cada una para relacionarla con sus productos
  const idsPorNombre = {};
  for (const { name } of datos.category) {
    const categoria = await Category.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { upsert: true, returnDocument: 'after' }
    );
    idsPorNombre[name] = categoria._id;
  }
  console.log(`Categorías listas: ${datos.category.length}`);

  // 2) Productos: se traducen los campos del front viejo al modelo de la API
  for (const p of datos.products) {
    const categoryId = idsPorNombre[p.category];
    if (!categoryId) {
      throw new Error(`El producto "${p.name}" tiene una categoría inexistente: ${p.category}`);
    }
    await Product.updateOne(
      { name: p.name },
      {
        $set: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.quantity, // en el front viejo se llamaba quantity
          image: p.image,
          highlighted: p.highlighted,
          category: categoryId, // el texto "vestidos" pasa a ser el _id real
        },
      },
      { upsert: true, runValidators: true }
    );
  }
  console.log(`Productos listos: ${datos.products.length}`);
};

try {
  await cargarDatos();
} catch (error) {
  console.error('Error al cargar los datos:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
