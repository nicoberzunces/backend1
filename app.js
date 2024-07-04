import express from 'express';
import bodyParser from 'body-parser';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const PORT = 8080;

// Middleware para parsear application/json
app.use(bodyParser.json());

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});