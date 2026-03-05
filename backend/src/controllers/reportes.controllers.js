import * as reportesModel from '../models/reportes.models.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await reportesModel.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReporte = async (req, res) => {
  try {
    const { tipo, inicio, fin } = req.query;
    let data;

    if (tipo === 'multas') {
      data = await reportesModel.getReporteMultas(inicio, fin);
    } else {
      data = await reportesModel.getReportePrestamos(inicio, fin);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};