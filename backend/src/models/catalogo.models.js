import db from '../config/db.js';

export const getCatalogo = async (limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(*) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado'
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [limit, skip]);
    return rows;
}

export const getCatalogoByTitulo = async (titulo, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(*) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado' AND lib.Titulo LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${titulo}%`, limit, skip]);
    return [rows, rows.length ||0];
}

export const getCatalogoByGenero = async (genero, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(*) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
            INNER JOIN tbl_generos gen ON lib.Id_genero = gen.Id_genero 
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado' AND gen.Nombre LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${genero}%`, limit, skip]);
    return [rows, rows.length || 0];
}

export const getCatalogoAutor = async (autor, limit, skip) => {
    const [rows] = await db.query(`
        SELECT
            lib.Id_libro,
            lib.Titulo,
            aut.Nombre,
            CASE 
                WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                ELSE lib.Sinopsis
            END AS Sinopsis,
            lib.Imagen,
            COUNT(*) AS Ejemplares_Disponibles
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado' AND aut.Nombre LIKE ?
            GROUP BY lib.Id_libro
            LIMIT ? OFFSET ?;    
    `, [`%${autor}%`, limit, skip]);
    return [rows, rows.length || 0];
}

export const getTotalLibros = async () => {
    const [rows] = await db.query(`
        SELECT COUNT(DISTINCT lib.Id_libro) as total
            FROM tbl_ejemplares ejem
            INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
            INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
            INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
            WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado';
    `);
    return rows[0].total;
}