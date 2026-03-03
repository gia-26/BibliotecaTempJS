import * as inicioModel from '../models/inicio.models.js';

export const getAllLibros = async (req, res) => {
    try {
        const libros = await inicioModel.getAllLibros();
        res.status(200).json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllInfoBiblioteca = async (req, res) => {
    try {
        const infoBiblioteca = await inicioModel.getAllInfoBiblioteca();
        res.status(200).json(infoBiblioteca);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllPersonal = async (req, res) => {
    try {
        const personal = await inicioModel.getAllPersonal();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}