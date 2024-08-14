import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';

// Conectar a MongoDB
const mongoURI = 'mongodb+srv://nicoberzunces02:DnZcOn4cUs3jdfca@coderback.kjuhq.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

const app = express();
const port = 8080;

// Configuración de rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/products', async (req, res) => {
  try {
    const { category, status, sort } = req.query; // Obtiene los parámetros de búsqueda y ordenamiento

    const filePath = path.join(__dirname, 'productos.json');
    const data = await fs.readFile(filePath, 'utf8');
    let products = JSON.parse(data);

    // Filtrar por categoría
    if (category) {
      products = products.filter(product => product.category === category);
    }

    // Filtrar por disponibilidad
    if (status) {
      products = products.filter(product => product.status.toString() === status);
    }

    // Ordenar por precio
    if (sort) {
      const sortOrder = sort === 'asc' ? 1 : -1;
      products.sort((a, b) => (a.price - b.price) * sortOrder);
    }

    res.render('productList', { products });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).render('error', { message: 'Error al cargar los productos' });
  }
});

// Ruta para ver detalles de un producto
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID del producto desde la URL

    const filePath = path.join(__dirname, 'productos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(data);
    
    // Encuentra el producto con el ID proporcionado
    const product = products.find(p => p._id === id);

    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }

    res.render('productDetails', { product });
  } catch (error) {
    console.error('Error al cargar detalles del producto:', error);
    res.status(500).render('error', { message: 'Error al cargar los detalles del producto' });
  }
});

// Iniciando el servidor
const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Configuración de Socket.IO
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Emitir productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'productos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(data);

    io.emit('updateProducts', products); // Emitir productos a todos los clientes conectados
    res.render('productList', { products });
  } catch (error) {
    console.error('Error al cargar productos en tiempo real:', error);
    res.status(500).render('error', { message: 'Error al cargar los productos' });
  }
});

// Agregar la ruta para carritos (ejemplo)
import cartsRouter from './routes/carts.js'; // Ajusta la ruta si es necesario
app.use('/api/carts', cartsRouter);

export default app;
