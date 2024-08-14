import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Ruta para obtener los productos desde el archivo productos.json
router.get('/', async (req, res) => {
    try {
        // Ruta del archivo productos.json
        const filePath = path.join(process.cwd(), 'productos.json');
        
        // Leer el archivo
        const data = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(data);

        // Responder con los productos
        res.json({
            status: 'success',
            payload: products,
            totalPages: 1, // Puedes ajustar la paginación si es necesario
            prevPage: null,
            nextPage: null,
            page: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: null,
            nextLink: null
        });
    } catch (error) {
        console.error('Error al leer los productos:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error del servidor'
        });
    }
});

export default router;
