import * as prestamosModel from '../models/prestamos.models.js';

//validar todos los controladores para evitar errores y manejar excepciones
export const getAllEjemplares = async (req, res) => {
  try {
    const ejemplares = await prestamosModel.getAllEjemplares();
    res.status(200).json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllTiposPrestamos = async (req, res) => {
  try {
    const tiposPrestamos = await prestamosModel.getAllTiposPrestamos();
    res.status(200).json(tiposPrestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const registrarPrestamo = async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body;
    const result = await prestamosModel.registrarPrestamo(data);
    console.log("RESULTADO CONTROLADOR:", result);
    //PENDIENTE: Revisar el resultado del SP para determinar si fue exitoso o no
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllPrestamos = async (req, res) => {
  try {
    const prestamos = await prestamosModel.getAllPrestamos();
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const devolverPrestamo = async (req, res) => {
  try {
    const idPrestamo = req.body.id;
    const result = await prestamosModel.devolverPrestamo(idPrestamo);
    console.log("RESULTADO CONTROLADOR:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}