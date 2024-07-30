import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const carritoFilePath = './data/carrito.json';


router.post('/', (req, res) => {
  try {
    const newCart = {
      id: uuidv4(),
      products: []
    };

    fs.writeFileSync(carritoFilePath, JSON.stringify(newCart, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});


router.post('/:cid/product/:pid', (req, res) => {
  try {
    const { quantity } = req.body;
    const carritoId = req.params.cid;
    const productId = req.params.pid;

    let carritos = JSON.parse(fs.readFileSync(carritoFilePath, 'utf-8'));
    let carrito = carritos.find(c => c.id === carritoId);

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    let product = carrito.products.find(p => p.id === productId);

    if (product) {
      product.quantity += parseInt(quantity);
    } else {
      carrito.products.push({ id: productId, quantity: parseInt(quantity) });
    }

    fs.writeFileSync(carritoFilePath, JSON.stringify(carritos, null, 2));
    res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;