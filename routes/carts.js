import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
const router = express.Router();
const carritoFilePath = './data/carrito.json';

// POST /api/carts/
router.post('/', (req, res) => {
  try {
    const newCart = {
      id: uuidv4(),
      products: []
    };

    fs.writeFileSync(carritoFilePath, JSON.stringify(newCart, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  try {
    const { quantity } = req.body;
    const carrito = JSON.parse(fs.readFileSync(carritoFilePath, 'utf-8'));
    const productId = req.params.pid;

    // Verificar si el producto ya está en el carrito
    let productExists = false;
    carrito.products.forEach(product => {
      if (product.id === productId) {
        product.quantity += parseInt(quantity);
        productExists = true;
      }
    });

    if (!productExists) {
      carrito.products.push({ id: productId, quantity: parseInt(quantity) });
    }

    fs.writeFileSync(carritoFilePath, JSON.stringify(carrito, null, 2));
    res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;