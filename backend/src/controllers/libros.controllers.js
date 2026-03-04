import * as librosModel from '../models/libros.models.js';

export const getLibrosById = async (req, res) => {
    try {
        const { id } = req.params;
        const libro = await librosModel.getLibrosById(id);
        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}