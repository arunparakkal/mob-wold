 const User = require("../model/userModel")
 const adminHelper = require("../helper/adminHelper")
 const Order = require('../model/orderModel')
const loadLogin = async(req,res)=>{
    try{
        res.render("login")
    }
    catch(error){
        console.log(error.message);
    }
}
const Logout = async (req, res) => {
    try {
       
        delete req.session.user_id
        res.redirect("login")

    }
    catch (Error) {
        console.log(Error.message);
    }
}
const verifyLogin = async(req,res)=>{

    try{
        await adminHelper.verifyloagin(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}

const loadUser = async(req,res)=>{

    try{
        
        const users = await User.find()
       
        res.render("users",{users})
    }
    catch(error){
        console.log(error.message);
    }
}
const blockUser = async(req,res)=>{
    try{
        await adminHelper.blockuser(req,res)
        
    }
    catch(error){
        console.log(error.message);
    }
}
const unblockUser = async(req,res)=>{
    try{
        await adminHelper.unblockuser(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}

const orderListing = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 10;
  
  
      const skipp = (page - 1) * itemsPerPage;
  
      const orders = await Order.find()
        .sort({ orderDate: -1 }) 
        .skip(skipp)
        .limit(itemsPerPage)
        .populate('products.productId userId');
       
  
      const totalOrders = await Order.countDocuments();
  
      const formattedOrders = orders.map((order) => {
        return {
          ...order.toObject(),
          formattedOrderDate: order.orderDate.toLocaleDateString(),
        };
      });
  
      const totalPages = Math.ceil(totalOrders / itemsPerPage);
  
      res.render('orderlist', {
        orders: formattedOrders,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  
  
  
  const orderDetailView = async(req, res)=>{
     
      try{
          const orderId = req.params.orderId;
          const orders = await Order.findById(orderId).populate('products.productId userId');
          
          res.render('orderDetail',{orders: [orders]})
      }catch(error){
        console.log(error.message)
      }
  }
  const updateStatus = async(req, res)=>{
    try{
       
        const { orderId } = req.params;
        const { newStatus } = req.body;
        console.log('status',req.body)
        console.log('id',orderId)
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (order.orderStatus === 'Delivered') {
          return res.status(400).json({ message: 'Order is already delivered' });
      }
        if (order.orderStatus === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already canceled' });
        }
        order.orderStatus = newStatus;

        if (newStatus === 'Delivered') {
          order.delivered = {
              deliveredDate: new Date(),
          };
        }
        console.log('kgfk')
        await order.save();

        res.json({ success:true });

    }catch(error){
        res.render('/error')
    }
}
module.exports = {
    loadLogin,
    verifyLogin ,
    loadUser,
    blockUser,
    unblockUser,
    orderDetailView,
    orderListing,
    updateStatus,
    Logout
}