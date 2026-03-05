import db from '../config/db.js';

export const getLibrosById = async (id) => {
    const [rows] = await db.query(`
        SELECT
            lib.Titulo,
            lib.Sinopsis,
            lib.Edicion,

            (SELECT aut.Nombre
                FROM tbl_autores aut
                WHERE aut.Id_autor = lib.Id_autor) AS Autor,

            (SELECT edit.Nombre
                FROM tbl_editoriales edit
                WHERE edit.Id_editorial = lib.Id_editorial) AS Editorial,

            (SELECT gen.Nombre
                FROM tbl_generos gen
                WHERE gen.Id_genero = lib.Id_genero) AS Genero,

            lib.ISBN,
            lib.Imagen,

            (SELECT anios.Anio_edicion
                FROM tbl_anios_edicion anios
                WHERE anios.Id_anio_edicion = lib.Id_anio_edicion) AS Anio

        FROM tbl_libros lib
        WHERE lib.Id_libro = ? AND lib.Estado != 0;
    `, [id]);
    return rows;
}