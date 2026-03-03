import db from '../config/db.js';

export const getAllLibros = async () => {
    const [rows] = await db.query(`
        SELECT 
            lib.Id_libro,
            lib.Titulo, 
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis 
            END AS Sinopsis,
            lib.Edicion,
            lib.Imagen,
            edit.Nombre AS 'Editorial', 
            aut.Nombre AS 'Autor', 
            gen.Nombre AS 'Genero', 
            anioEd.Anio_edicion, 
            lib.ISBN, 
            aCon.Area_conocimiento 
        FROM tbl_libros lib 
        INNER JOIN tbl_editoriales edit ON lib.Id_editorial = edit.Id_editorial 
        INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor 
        INNER JOIN tbl_generos gen ON lib.Id_genero = gen.Id_genero 
        INNER JOIN tbl_anios_edicion anioEd ON lib.Id_anio_edicion = anioEd.Id_anio_edicion 
        INNER JOIN tbl_areas_conocimiento aCon ON lib.Id_area_conocimiento = aCon.Id_area_conocimiento 
        WHERE lib.Estado != 0 LIMIT 12;    
    `);
    return rows;
}

export const getAllInfoBiblioteca = async () => {
    const [rows] = await db.query(`
        SELECT
            ib.QuienesSomos,
            ib.NuestraHistoria,
            ib.Mision,
            ib.Vision,
            ib.Objetivo
        FROM tbl_informacion_biblioteca ib;
    `);
    return rows;
}

export const getAllPersonal = async () => {
    const [rows] = await db.query(`
        SELECT
            trab.Nombre,
            trab.Apellido_P,
            trab.Apellido_M,
            rols.Tipo_rol
        FROM tbl_personal pers
        INNER JOIN tbl_roles rols ON pers.Id_rol = rols.Id_rol
        INNER JOIN tbl_trabajadores trab ON pers.Id_trabajador = trab.Id_trabajador
        WHERE pers.Estado != 0;    
    `);
    return rows;
}