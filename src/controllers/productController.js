import * as productService from '../services/productService.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await productService.obtenerProductos(req.query);
    res.status(200).json(productos);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const getProductoPorId = async (req, res) => {
  try {
    const producto = await productService.obtenerProductoPorId(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const postProducto = async (req, res) => {
  try {
    const producto = await productService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const putProducto = async (req, res) => {
  try {
    const producto = await productService.actualizarProducto(req.params.id, req.body);
    res.status(200).json(producto);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    await productService.eliminarProducto(req.params.id);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

