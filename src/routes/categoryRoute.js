import { Router } from 'express';
import {
  getCategorias,
  getCategoriaPorId,
  postCategoria,
  deleteCategoria,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoriaPorId);
router.post('/', postCategoria);
router.delete('/:id', deleteCategoria);

export default router;

