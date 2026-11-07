import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/userController.js';

const router = Router();

// Máximo 5 intentos cada 15 minutos por IP, para frenar ataques de fuerza bruta
const limiteAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { mensaje: 'Demasiados intentos. Probá de nuevo en 15 minutos.' },
});

router.post('/register', limiteAuth, register);
router.post('/login', limiteAuth, login);

export default router;