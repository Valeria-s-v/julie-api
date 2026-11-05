import { Router } from 'express';
import {
  getCategorias,
  getCategoriaPorId,
  postCategoria,
  deleteCategoria,
} from '../controllers/categoryController.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoriaPorId);
router.post('/', verifyToken, verifyAdmin, postCategoria);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategoria);

export default router;

