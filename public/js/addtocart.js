const addtocartBottons = document.querySelectorAll(".addtocartbtn")
console.log(addtocartBottons); 
addtocartBottons.forEach((button) =>{

button.addEventListener('click',(e)=>{
  e.preventDefault()
  const productId = button.getAttribute("data-productId")
 
  fetch('/addtocart',{
    method:"post",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({
      productId,
      quantity:1
    })
  })
})
 
})
