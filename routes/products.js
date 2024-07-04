import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
const router = express.Router();
const productosFilePath = './data/productos.json';

// GET /api/products/
router.get('/', (req, res) => {
  try {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST /api/products/
router.post('/', (req, res) => {
  try {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
      id: uuidv4(),  // Generación automática del ID
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    productos.push(newProduct);
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

export default router;