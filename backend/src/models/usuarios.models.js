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

// Obtener lista de multas del usuario
export const getMultasByUsuario = async (idUsuario) => {

  const [rows] = await db.query(`
    SELECT 
      m.Id_multa,
      lib.Titulo,
      m.Monto,
      m.Dias_excedidos,
      pres.Fecha_devolucion,
      pres.Fecha_devolucion_real
    FROM tbl_multas m
    INNER JOIN tbl_prestamos pres 
      ON m.Id_prestamo = pres.Id_prestamo
    INNER JOIN tbl_ejemplares ejm 
      ON pres.Id_ejemplar = ejm.Id_ejemplar
    INNER JOIN tbl_libros lib 
      ON ejm.Id_libro = lib.Id_libro
    WHERE pres.Id_usuario = ?
    ORDER BY m.Id_multa DESC
  `, [idUsuario]);

  return rows;
};

// Obtener resumen
export const getResumenMultas = async (idUsuario) => {

  const [rows] = await db.query(`
    SELECT 
      IFNULL(SUM(Monto), 0) AS MontoTotal
    FROM tbl_multas m
    INNER JOIN tbl_prestamos pres 
      ON m.Id_prestamo = pres.Id_prestamo
    WHERE pres.Id_usuario = ?
  `, [idUsuario]);

  return rows[0];
};