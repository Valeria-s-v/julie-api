import { Router } from 'express';
import {
  getProductos,
  getProductoPorId,
  postProducto,
  putProducto,
  deleteProducto,
} from '../controllers/productController.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProductoPorId);
router.post('/', verifyToken, verifyAdmin, postProducto);
router.put('/:id', verifyToken, verifyAdmin, putProducto);
router.delete('/:id', verifyToken, verifyAdmin, deleteProducto);

export default router;
