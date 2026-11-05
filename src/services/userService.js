import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const crearError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

export const registrarUsuario = async (datos) => {
  const { name, email, password } = datos || {};
  if (!name || !email || !password) {
    throw crearError('Nombre, email y contraseña son obligatorios', 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw crearError('El email no es válido', 400);
  }
  if (password.length < 6) {
    throw crearError('La contraseña debe tener al menos 6 caracteres', 400);
  }
  const existe = await User.findOne({ email: email.toLowerCase().trim() });
  if (existe) {
    throw crearError('Ya existe un usuario con ese email', 400);
  }
  // El rol NO se toma del body: siempre queda como 'user'
  const usuario = await User.create({ name, email, password });
  return {
    id: usuario._id,
    name: usuario.name,
    email: usuario.email,
    role: usuario.role,
  };
};

export const loginUsuario = async (datos) => {
  const { email, password } = datos || {};
  if (!email || !password) {
    throw crearError('Email y contraseña son obligatorios', 400);
  }
  const usuario = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  // Mismo mensaje si falla el email o la contraseña: no se dan pistas
  if (!usuario || !(await usuario.compararPassword(password))) {
    throw crearError('Credenciales inválidas', 401);
  }
  const token = jwt.sign(
    { id: usuario._id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return {
    token,
    usuario: {
      id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    },
  };
};
