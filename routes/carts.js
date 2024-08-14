import express from 'express';
import Cart from '../models/Cart.js'; // Asegúrate de tener el modelo correcto importado

const router = express.Router();

// Obtener carrito por ID
router.get('/api/carts/:id', async (req, res) => {
  try {
    const cartId = req.params.id;

    // Asegúrate de que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'Invalid cart ID' });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
