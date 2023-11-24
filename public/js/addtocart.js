const addtocartBottons = document.querySelectorAll(".addtocartbtn")

addtocartBottons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    const productId = button.getAttribute("data-productId")

    fetch('/addtocart', {
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        quantity: 1
      })
    }).then(response => response.json()).then(data => {
      console.log(data);
      if (data.noStock) {
        return Swal.fire({
          icon: 'Failed',
          title: 'Out of Stock',
          text: 'Stock Coming Soon!..Thanks For ',
        });
      } else if (data.redirectToCart) {
        // Redirect to the cart page
        window.location.href = '/cart';
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Item added',
          text: 'The item has been successfully added to your cart!',
        });
      }
    })

  })

})
