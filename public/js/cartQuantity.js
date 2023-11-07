
const tableContainer = document.querySelectorAll('.tableContainer')

tableContainer.forEach((container)=>{

  const quantityInput = container.querySelector('.qtyInput');
  const increaseBtn = container.querySelector('.increaseBtn');
  const decreaseBtn = container.querySelector('.decreaseBtn');
  const productId = container.querySelector('.productId').value;
 
  const productSubtotal = container.querySelector('.productSubtotal')

 


increaseBtn.addEventListener('click',handleQty.bind(null,'increase',quantityInput,productId,productSubtotal))
decreaseBtn.addEventListener('click',handleQty.bind(null,'decrease',quantityInput,productId,productSubtotal))

})


function handleQty(action,quantityInput,productId,productSubtotal){


  let currentQty = parseInt(quantityInput.value)
     
  let newQuantity;
  
  if(action ==='increase'){
     newQuantity = currentQty+1;
  }else if(action === 'decrease'){
    newQuantity = Math.max(1,(currentQty-1))
  }

  updateQty(productId,newQuantity).then((response)=>{
    const cartItem = response.products.find((product)=>{
      return product.productId === productId
    })
   
    
    quantityInput.value=cartItem.quantity;
    productSubtotal.textContent =cartItem.subTotal


    const cartSubtotal = document.querySelector('.cartSubtotal')
    cartSubtotal.textContent=response.cartSubtotal;
    const cartTotal = document.querySelector('.cartTotal')
    cartTotal.textContent=response.cartTotal


  })


}



async function updateQty(productId,newQuantity){

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