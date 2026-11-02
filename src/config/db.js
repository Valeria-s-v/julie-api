import mongoose from 'mongoose';

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1); // si no hay base, no tiene sentido seguir
  }
};

