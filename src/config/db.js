import mongoose from 'mongoose';

let conexion = null;

export const conectarDB = async () => {
  // Si ya hay una conexión abierta, la reutiliza
  if (mongoose.connection.readyState === 1) return;

  if (!conexion) {
    conexion = mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log('Conectado a MongoDB Atlas'))
      .catch((error) => {
        conexion = null; // permite reintentar en el próximo pedido
        throw error;
      });
  }
  await conexion;
};

