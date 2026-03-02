import * as multasModel from "../models/multas.models.js";

export const getAllMultas = async (req, res) => {
    try {
        const multas = await multasModel.getAllMultas();
        res.status(200).json(multas);   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}