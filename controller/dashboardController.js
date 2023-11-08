
const Order = require("../model/orderModel")
const LoadSalesRoprt = async(req,res)=>{
  try{
   const userId = req.session.use
    const orderData = await Order.find()
    // console.log("orderData",orderData);
    
   
    res.render("salesreport",{orderData})
  }
  catch(error){
    console.log(error.message);
  }
}
module.exports = {
  LoadSalesRoprt
}