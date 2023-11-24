
const tableContainer = document.querySelectorAll('.tableContainer')

tableContainer.forEach((container)=>{

  const quantityInput = container.querySelector('.qtyInput');
  const increaseBtn = container.querySelector('.increaseBtn');
  const decreaseBtn = container.querySelector('.decreaseBtn');
  const maxQuantityInput = container.querySelector('.max-quantity');
  const productId = container.querySelector('.productId').value;
  let maxQuantity = parseInt(maxQuantityInput.value);

  console.log('hetthe',maxQuantity);
 
  const productSubtotal = container.querySelector('.productSubtotal')

 


increaseBtn.addEventListener('click',handleQty.bind(null,'increase',quantityInput,productId,productSubtotal,maxQuantity))
decreaseBtn.addEventListener('click',handleQty.bind(null,'decrease',quantityInput,productId,productSubtotal,maxQuantity))

})

   
async function handleQty(action, quantityInput, productId, productSubtotal, maxQuantity) {
  let currentQty = parseInt(quantityInput.value);

  let newQuantity;
  if (action === 'increase') {
   
   
    if (currentQty === maxQuantity) {
     newQuantity = currentQty
      Swal.fire({
        title: 'Quantity Limit Reached',
        text: 'You cannot add more than ' + maxQuantity + ' of this product.',
        icon: 'warning',
        showConfirmButton: true
      });
      
    }else{
    
      
      newQuantity = currentQty + 1;
    }
  } else if (action === 'decrease') {
    newQuantity = Math.max(1, currentQty - 1);
  }
 

  try {
    const response = await updateQty(productId, newQuantity);
    console.log('response',response);

    const cartItem = response.products.find((product) => product.productId === productId);

    quantityInput.value = cartItem.quantity;
    productSubtotal.textContent = cartItem.subTotal;

    const cartSubtotal = document.querySelector('.cartSubtotal');
    cartSubtotal.textContent = response.cartSubtotal;
    const cartTotal = document.querySelector('.cartTotal');
    cartTotal.textContent = response.cartTotal;
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
}




async function updateQty(productId,newQuantity){
console.log('uuuuuuuuuuuuu');
 return  await fetch('/cart-quantity',{
    method:'post',
    headers:{
      "Content-Type":'application/json'
    },
    body:JSON.stringify({
      productId,
      quantity:newQuantity

    })
  }).then((response)=>response.json())
}