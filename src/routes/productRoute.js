import { Router } from 'express';
import {
  getProductos,
  getProductoPorId,
  postProducto,
  putProducto,
  deleteProducto,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProductoPorId);
router.post('/', postProducto);
router.put('/:id', putProducto);
router.delete('/:id', deleteProducto);

export default router;

