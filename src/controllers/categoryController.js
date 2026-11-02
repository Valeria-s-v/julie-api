import * as categoryService from '../services/categoryService.js';

export const getCategorias = async (req, res) => {
  try {
    const categorias = await categoryService.obtenerCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const getCategoriaPorId = async (req, res) => {
  try {
    const categoria = await categoryService.obtenerCategoriaPorId(req.params.id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const postCategoria = async (req, res) => {
  try {
    const categoria = await categoryService.crearCategoria(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const deleteCategoria = async (req, res) => {
  try {
    await categoryService.eliminarCategoria(req.params.id);
    res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

