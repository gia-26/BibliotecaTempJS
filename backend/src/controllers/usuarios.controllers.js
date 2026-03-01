import * as usuariosModels from '../models/usuarios.models.js';

export const getUsuariosById = async (req, res) => {
    try {
        if (!req.query.id || !req.query.tipo) {
            return res.status(400).json({
                error: "Faltan parámetros id o tipo"
            });
        }
        const usuario = await usuariosModels.getUsuariosById(req.query);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllTiposUsuario = async (req, res) => {
  try {
    const tiposUsuario = await usuariosModels.getAllTiposUsuario();
    res.status(200).json(tiposUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}