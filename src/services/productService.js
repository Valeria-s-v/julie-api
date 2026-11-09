import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const crearError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

// Solo estos campos se pueden enviar. Ignora cualquier otro
const CAMPOS = ['name', 'description', 'price', 'stock', 'image', 'sizes', 'colors', 'category', 'highlighted'];
const filtrarCampos = (datos = {}) =>
  Object.fromEntries(Object.entries(datos).filter(([clave]) => CAMPOS.includes(clave)));

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw crearError('ID de producto inválido', 400);
  }
};

const validarCategoria = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw crearError('ID de categoría inválido', 400);
  }
  const existe = await Category.exists({ _id: categoryId });
  if (!existe) {
    throw crearError('La categoría no existe', 400);
  }
};

export const obtenerProductos = async (query = {}) => {
  const filtro = {};
  if (query.category) {
    if (!mongoose.isValidObjectId(query.category)) {
      throw crearError('ID de categoría inválido', 400);
    }
    filtro.category = query.category;
  }
  return await Product.find(filtro).populate('category', 'name description');
};

export const obtenerProductoPorId = async (id) => {
  validarId(id);
  const producto = await Product.findById(id).populate('category', 'name description');
  if (!producto) {
    throw crearError('Producto no encontrado', 404);
  }
  return producto;
};

export const crearProducto = async (datos) => {
  const campos = filtrarCampos(datos);
  if (!campos.name || !String(campos.name).trim()) {
    throw crearError('El nombre es obligatorio', 400);
  }
  if (campos.price === undefined || Number(campos.price) < 0 || Number.isNaN(Number(campos.price))) {
    throw crearError('El precio es obligatorio y no puede ser negativo', 400);
  }
  if (!campos.category) {
    throw crearError('La categoría es obligatoria', 400);
  }
  await validarCategoria(campos.category);
  const producto = await Product.create(campos);
  return await producto.populate('category', 'name description');
};

export const actualizarProducto = async (id, datos) => {
  validarId(id);
  const campos = filtrarCampos(datos);
  if (Object.keys(campos).length === 0) {
    throw crearError('No hay datos para actualizar', 400);
  }
  if (campos.category) {
    await validarCategoria(campos.category);
  }
  const producto = await Product.findByIdAndUpdate(id, campos, {
    returnDocument: 'after', // devuelve el producto ya actualizado
    runValidators: true,  // aplica las reglas del modelo (min, required...)
  }).populate('category', 'name description');
  if (!producto) {
    throw crearError('Producto no encontrado', 404);
  }
  return producto;
};

export const eliminarProducto = async (id) => {
  validarId(id);
  const producto = await Product.findByIdAndDelete(id);
  if (!producto) {
    throw crearError('Producto no encontrado', 404);
  }
  return producto;
};


