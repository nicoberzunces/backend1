import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const productosFilePath = './data/productos.json';

router.get('/', (req, res) => {
  try {
    const productosData = fs.readFileSync(productosFilePath, 'utf-8');
    const productos = JSON.parse(productosData);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.post('/', (req, res) => {
  try {
    const productosData = fs.readFileSync(productosFilePath, 'utf-8');
    const productos = JSON.parse(productosData);
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
      id: uuidv4(),
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
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const productosData = fs.readFileSync(productosFilePath, 'utf-8');
    let productos = JSON.parse(productosData);
    const id = req.params.id;

    productos = productos.filter(producto => producto.id !== id);
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;