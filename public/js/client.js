const socket = io();

socket.on('productos', (productos) => {
  actualizarListaProductos(productos);
});

function actualizarListaProductos(productos) {
  const lista = document.getElementById('productos-lista');
  lista.innerHTML = '';
  productos.forEach((producto) => {
    const li = document.createElement('li');
    li.id = `producto-${producto.id}`;
    li.textContent = `${producto.title} - ${producto.price}`;
    lista.appendChild(li);
  });
}

document.getElementById('form-agregar').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const producto = {
    title: formData.get('title'),
    price: parseFloat(formData.get('price'))
  };
  socket.emit('nuevoProducto', producto);
  event.target.reset();
});