import db from '../config/db.js';

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