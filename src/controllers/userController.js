import * as userService from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const usuario = await userService.registrarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const resultado = await userService.loginUsuario(req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ mensaje: error.message });
  }
};
