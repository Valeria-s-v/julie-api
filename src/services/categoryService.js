import mongoose from 'mongoose';
import Category from '../models/categoryModel.js';

// Error con código HTTP, para que el controlador sepa qué responder
const crearError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

export const obtenerCategorias = async () => {
  return await Category.find().sort({ name: 1 });
};

export const obtenerCategoriaPorId = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw crearError('ID de categoría inválido', 400);
  }
  const categoria = await Category.findById(id);
  if (!categoria) {
    throw crearError('Categoría no encontrada', 404);
  }
  return categoria;
};

export const crearCategoria = async (datos) => {
  const { name, description } = datos;
  if (!name || !name.trim()) {
    throw crearError('El nombre es obligatorio', 400);
  }
  const existe = await Category.findOne({ name: name.trim() });
  if (existe) {
    throw crearError('Ya existe una categoría con ese nombre', 400);
  }
  return await Category.create({ name, description });
};

export const eliminarCategoria = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw crearError('ID de categoría inválido', 400);
  }
  const categoria = await Category.findByIdAndDelete(id);
  if (!categoria) {
    throw crearError('Categoría no encontrada', 404);
  }
  return categoria;
};

