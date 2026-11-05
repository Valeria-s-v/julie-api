import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado: falta el token' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o vencido' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol admin' });
  }
  next();
};
