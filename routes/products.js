import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// Ruta para mostrar la lista de productos
router.get('/', async (req, res) => {
  try {
    // Ruta del archivo productos.json
    const filePath = path.join(process.cwd(), 'productos.json');
    
    // Leer el archivo
    const data = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(data);

    // Renderizar la vista de productos
    res.render('productList', {
      title: 'Lista de Productos',
      products: products
    });
  } catch (error) {
    console.error('Error al leer los productos:', error);
    res.status(500).render('error', { message: 'Error del servidor al cargar productos' });
  }
});

export default router;
