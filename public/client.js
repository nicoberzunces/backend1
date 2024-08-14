function addToCart(productId) {
  fetch(`/api/carts/1/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: 1 }), // Puedes ajustar la cantidad según sea necesario
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Product added to cart');
    } else {
      alert('Failed to add product to cart');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
