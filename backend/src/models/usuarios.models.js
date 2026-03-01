import db from '../config/db.js';

export const getUsuariosById = async ({id, tipo}) => {
    if (tipo === 'TU001') {
        const [rows] = await db.query('SELECT Nombre FROM tbl_alumnos WHERE Id_alumno = ?', [id]);
        return rows[0];
    }
    else if (tipo === 'TU002') {
        const [rows] = await db.query('SELECT Nombre FROM tbl_trabajadores WHERE Id_trabajador = ?', [id]);
        return rows[0];
    }
}

export const getAllTiposUsuario = async () => {
  const [rows] = await db.query(`SELECT * FROM tbl_tipo_usuarios`);
  return rows;
}