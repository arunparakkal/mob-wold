
document.addEventListener("DOMContentLoaded",function(){
  const cartCloseIcon = document.querySelectorAll(".cart__close")
  cartCloseIcon.forEach((icon)=>{
    icon.addEventListener("click",function(event){
      const cartItem = event.target.closest(".tableContainer")
      if(cartItem){
        const itemId = cartItem.getAttribute("data-id")
        fetch(`./remove-from-cart/${itemId}`,{
          method:"delete"
        })
        .then((response)=> response.json())
        .then((data)=>{
          if(data.success){
            cartItem.remove()
          }
          else{
            console.error("Failed to remove item from the cart")
          }
        })
        .catch((error)=>{
          console.log("erropage");
          console.log("Error",error)
        })
        
      }
    })
  })
})