import db from '../config/db.js';

//Pasar consulta a vista para simplificar el código
export const getAllEjemplares = async () => {
  const [rows] = await db.query(`
    SELECT 
        ejm.Id_libro AS 'Id_libro', 
        lib.Titulo AS 'Titulo', 
        aut.Nombre AS Autor, 
        ejm.Id_ejemplar AS 'Id_Ejemplar', 
        ejm.Num_ejemplar AS 'Numero_de_ejemplar', 
        esEjm.Estado_ejemplar AS 'Estado' 
    FROM tbl_ejemplares ejm 
    INNER JOIN tbl_libros lib ON ejm.Id_libro = lib.Id_libro 
    INNER JOIN tbl_estado_ejemplar esEjm ON ejm.Id_estado_ejemplar = esEjm.Id_estado_ejemplar 
    INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor 
    WHERE lib.Estado = 1 ORDER BY lib.Titulo ASC`);
  return rows;
}

export const getAllTiposPrestamos = async () => {
  const [rows] = await db.query(`SELECT * FROM tbl_tipos_prestamos`);
  return rows;
}

export const registrarPrestamo = async (data) => {
  const [result] = await db.query(`CALL sp_registrar_prestamo(?, ?, ?, ?, ?)`, 
    [data.idUsuario, data.idEjemplar, data.idBibliotecario, data.idTipoPrestamo, data.idTipoUsuario]
  );

  //PENDIENTE 
  console.log("RESULTADO SP:", result[0]);
  if (result[0].success)
    return { success: true, mensaje: result[0].message };
  else
    return { success: false, mensaje: result[0].message };
}

export const devolverPrestamo = async (idPrestamo) => {
  const [[result]] = await db.query(`CALL sp_registrar_devolucion(?)`, [idPrestamo]);
  //PENDIENTE 
  console.log("RESULTADO SP:", result);
  if (result.success)
    return { success: true, mensaje: result.message };
  else
    return { success: false, mensaje: result.message };
}

//Pasar consulta a vista para simplificar el código
export const getAllPrestamos = async () => {
  const [rows] = await db.query(`
      SELECT
          pres.Id_prestamo,
          us.Id_usuario,
          alum.Nombre,
          lib.Id_libro,
          lib.Titulo,
          pres.Fecha_prestamo, 
          pres.Fecha_devolucion, 
          estPres.Tipo_estado AS Estado
          FROM tbl_prestamos pres 
          INNER JOIN tbl_usuarios us ON pres.Id_usuario = us.Id_usuario 
          INNER JOIN tbl_ejemplares ejm ON pres.Id_ejemplar = ejm.Id_ejemplar 
          INNER JOIN tbl_libros lib ON ejm.Id_libro = lib.Id_libro 
          INNER JOIN tbl_estados_prestamos estPres ON pres.Id_estado_prestamo = estPres.Id_estado_prestamo 
          INNER JOIN tbl_alumnos alum ON us.Id_usuario = alum.Id_alumno 
          WHERE us.Id_tipo_usuario = 'TU001' and estPres.Id_estado_prestamo in ('EP001','EP003') 
      UNION ALL 
      SELECT
          pres.Id_prestamo,
          us.Id_usuario,
          trab.Nombre,    
          lib.Id_libro, 
          lib.Titulo, 
          pres.Fecha_prestamo, 
          pres.Fecha_devolucion, 
          estPres.Tipo_estado AS Estado 
          FROM tbl_prestamos pres 
          INNER JOIN tbl_usuarios us ON pres.Id_usuario = us.Id_usuario 
          INNER JOIN tbl_ejemplares ejm ON pres.Id_ejemplar = ejm.Id_ejemplar 
          INNER JOIN tbl_libros lib ON ejm.Id_libro = lib.Id_libro 
          INNER JOIN tbl_estados_prestamos estPres ON pres.Id_estado_prestamo = estPres.Id_estado_prestamo 
          INNER JOIN tbl_trabajadores trab ON us.Id_usuario = trab.Id_trabajador 
          WHERE us.Id_tipo_usuario = 'TU002' and estPres.Id_estado_prestamo in ('EP001','EP003');
  `);
  return rows;
}