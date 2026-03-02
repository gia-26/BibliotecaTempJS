import db from "../config/db.js";

export const getAllMultas = async () => {
    const [rows] = await db.query(`
        SELECT 
            alum.Nombre, 
            alum.Apellido_P, 
            alum.Apellido_M, 
            lib.Titulo, 
            pres.Fecha_devolucion, 
            pres.Fecha_devolucion_real, 
            mult.Dias_excedidos, 
            mult.Monto 
            FROM tbl_multas mult 
            INNER JOIN tbl_prestamos pres ON mult.Id_prestamo = pres.Id_prestamo 
            INNER JOIN tbl_alumnos alum ON pres.Id_usuario = alum.Id_alumno 
            INNER JOIN tbl_ejemplares ejm ON pres.Id_ejemplar = ejm.Id_ejemplar 
            INNER JOIN tbl_libros lib ON ejm.Id_libro = lib.Id_libro 
        UNION ALL
        SELECT 
            trab.Nombre, 
            trab.Apellido_P, 
            trab.Apellido_M, 
            lib.Titulo, 
            pres.Fecha_devolucion, 
            pres.Fecha_devolucion_real, 
            mult.Dias_excedidos, 
            mult.Monto 
            FROM tbl_multas mult 
            INNER JOIN tbl_prestamos pres ON mult.Id_prestamo = pres.Id_prestamo 
            INNER JOIN tbl_trabajadores trab ON pres.Id_usuario = trab.Id_trabajador 
            INNER JOIN tbl_ejemplares ejm ON pres.Id_ejemplar = ejm.Id_ejemplar 
            INNER JOIN tbl_libros lib ON ejm.Id_libro = lib.Id_libro;    
    `);
    return rows;
}