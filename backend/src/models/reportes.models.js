import db from '../config/db.js';

export const getDashboardStats = async () => {
  // Realizamos múltiples conteos en una sola consulta para optimizar
  const [rows] = await db.query(`
    SELECT 
      (SELECT SUM(Monto) FROM tbl_multas) AS TotalMultas,
      (SELECT COUNT(*) FROM tbl_prestamos) AS TotalPrestamos,
      (SELECT COUNT(*) FROM tbl_prestamos WHERE Id_estado_prestamo IN ('EP001', 'EP003')) AS LibrosDevolver
  `);
  // Si TotalMultas es null (no hay multas), devolvemos 0
  return {
    TotalMultas: rows[0].TotalMultas || 0,
    TotalPrestamos: rows[0].TotalPrestamos || 0,
    LibrosDevolver: rows[0].LibrosDevolver || 0
  };
};

export const getReporteMultas = async (inicio, fin) => {
  const [rows] = await db.query(`
    SELECT 
      COALESCE(a.Nombre, t.Nombre) AS Nombre,
      COALESCE(a.Apellido_P, t.Apellido_P) AS Apellido_P,
      COALESCE(a.Apellido_M, t.Apellido_M) AS Apellido_M,
      l.Titulo,
      p.Fecha_devolucion,
      p.Fecha_devolucion_real,
      m.Dias_excedidos,
      m.Monto
    FROM tbl_multas m
    INNER JOIN tbl_prestamos p ON m.Id_prestamo = p.Id_prestamo
    INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
    INNER JOIN tbl_libros l ON e.Id_libro = l.Id_libro
    INNER JOIN tbl_usuarios u ON p.Id_usuario = u.Id_usuario
    LEFT JOIN tbl_alumnos a ON u.Id_usuario = a.Id_alumno
    LEFT JOIN tbl_trabajadores t ON u.Id_usuario = t.Id_trabajador
    WHERE p.Fecha_devolucion_real BETWEEN ? AND ?
  `, [inicio, fin]);
  return rows;
};

export const getReportePrestamos = async (inicio, fin) => {
  const [rows] = await db.query(`
    SELECT 
      u.Id_usuario AS Id,
      COALESCE(a.Nombre, t.Nombre) AS Nombre,
      COALESCE(a.Apellido_P, t.Apellido_P) AS Apellido_P,
      COALESCE(a.Apellido_M, t.Apellido_M) AS Apellido_M,
      l.Id_libro,
      l.Titulo,
      p.Fecha_prestamo,
      p.Fecha_devolucion,
      p.Fecha_devolucion_real
    FROM tbl_prestamos p
    INNER JOIN tbl_ejemplares e ON p.Id_ejemplar = e.Id_ejemplar
    INNER JOIN tbl_libros l ON e.Id_libro = l.Id_libro
    INNER JOIN tbl_usuarios u ON p.Id_usuario = u.Id_usuario
    LEFT JOIN tbl_alumnos a ON u.Id_usuario = a.Id_alumno
    LEFT JOIN tbl_trabajadores t ON u.Id_usuario = t.Id_trabajador
    WHERE p.Fecha_prestamo BETWEEN ? AND ?
  `, [inicio, fin]);
  return rows;
};