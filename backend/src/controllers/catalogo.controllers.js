import * as catalogoModels from '../models/catalogo.models.js';

export const getCatalogo = async (req, res) => {
    try {
        let limit, skip;
        if (!req.query.limit || !req.query.skip) {
            limit = 5;
            skip = 0;
        }
        else {
            limit = parseInt(req.query.limit);
            skip = parseInt(req.query.skip);
        }
        const resultado = await catalogoModels.getCatalogo(limit, skip);
        const catalogo = {
            libros: resultado,
            total: await catalogoModels.getTotalLibros(),
            limit: limit,
            skip: skip
        };
        res.status(200).json(catalogo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getCatalogoByBusqueda = async (req, res) => {
    try {
        let limit = req.query.limit || 5, skip = req.query.skip || 0, resultado, total = 0;
        const tipo = req.query.tipo;
        const q = req.query.q;

        if (!tipo) res.status(400).json({ error: 'Tipo inválido' });
        if (!q) res.status(400).json({ error: 'Búsqueda incompleta' }); 
        
        limit = parseInt(req.query.limit);
        skip = parseInt(req.query.skip);
        
        switch (tipo)
        {
            case "titulo":
                [resultado, total] = await catalogoModels.getCatalogoByTitulo(q, limit, skip);
            break;
            case "autor":
                [resultado, total] = await catalogoModels.getCatalogoAutor(q, limit, skip);
            break;
            case "genero":
                [resultado, total] = await catalogoModels.getCatalogoByGenero(q, limit, skip);
            break;
        }
        
        const catalogo = {
            libros: resultado,
            total: total,
            limit: limit,
            skip: skip
        };

        res.status(200).json(catalogo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}