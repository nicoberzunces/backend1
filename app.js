import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import bodyParser from 'body-parser';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const PORT = 8080;
const productosFilePath = './data/productos.json';
const carritoFilePath = './data/carrito.json';


const hbs = create({ extname: '.handlebars' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(bodyParser.json());
app.use(express.static('public'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  const productos = obtenerProductos();
  res.render('home', { productos });
});

app.get('/realtimeproducts', (req, res) => {
  const productos = obtenerProductos();
  res.render('realTimeProducts', { productos });
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('productos', obtenerProductos());

  socket.on('nuevoProducto', (producto) => {
    agregarNuevoProducto(producto);
    io.emit('productos', obtenerProductos());
  });
});

function obtenerProductos() {
  try {
    const productosData = fs.readFileSync(productosFilePath, 'utf-8');
    return JSON.parse(productosData);
  } catch (error) {
    console.error('Error al leer productos:', error);
    return [];
  }
}

function agregarNuevoProducto(producto) {
  try {
    let productos = obtenerProductos();
    producto.id = uuidv4();
    productos.push(producto);
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
}

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

export default app;