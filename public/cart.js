// Función para manejar el clic en "View Details"
function handleViewDetailsClick(productId) {
    window.location.href = `/products/${productId}`;
  }
  
  // Añadir un evento click a los botones "View Details"
  document.querySelectorAll('.view-details-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      handleViewDetailsClick(productId);
    });
  });
  
  // Función para manejar el clic en "Agregar al carrito"
  document.querySelector('#add-to-cart')?.addEventListener('click', () => {
    const productId = document.querySelector('#add-to-cart').getAttribute('data-product-id');
    
    // Aquí puedes agregar la lógica para enviar una solicitud para agregar el producto al carrito
    fetch(`/api/carts/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al agregar al carrito');
      }
      return response.json();
    })
    .then(data => {
      alert('Producto agregado al carrito');
      // Opcional: Actualiza la interfaz del carrito aquí
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al agregar al carrito');
    });
  });
  