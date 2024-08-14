import mongoose from 'mongoose';
import Product from '../models/Product.js';
import fs from 'fs';

const mongoURI = 'mongodb+srv://nicoberzunces02:DnZcOn4cUs3jdfca@coderback.kjuhq.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

const productosData = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));

Product.insertMany(productosData)
  .then(() => console.log('Datos importados con éxito'))
  .catch(error => console.error('Error al importar datos:', error))
  .finally(() => mongoose.disconnect());