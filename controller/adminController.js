 const User = require("../model/userModel")
 const adminHelper = require("../helper/adminHelper")
 const Order = require('../model/orderModel')
 const Referraloffer = require("../model/refferalmoney")
 const Category = require("../model/categoryModel")
 const Product = require("../model/product")

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
       
        delete req.session.admin_id
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
      res.render('404',{user:req.session.admin_id})
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
      
        await order.save();

        res.json({ success:true });

    }catch(error){
        res.render('/error')
    }
}

async function calculateDeliveredOrderTotal() {
    try {
      const totalData = await Order.aggregate([
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$totalprice' },
            count: { $sum: 1 },
          },
        },
      ]);
  
      if (totalData.length === 0) {
        return {
          _id: null,
          totalPriceSum: 0,
          count: 0,
        };
      }

      return totalData;
    } catch (error) {
      throw error;
    }
  }
  
  async function calculateCategorySales() {
    try {
      const categorySalesData = await Order.aggregate([
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $unwind: '$productDetails',
        },
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'productDetails.categoryname',
            foreignField: 'categoryname',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails',
        },
        {
          $group: {
            _id: '$productDetails.categoryname',
            categoryName: { $first: '$categoryDetails.categoryname' },
            totalSales: {
              $sum: { $multiply: ['$productDetails.productprice', '$products.quantity'] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            categoryName: 1,
            totalSales: 1,
          },
        },
      ]);
  
      return categorySalesData;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function calculateDailySales() {
    try {
      const dailySalesData = await Order.aggregate([
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$orderDate',
              },
            },
            dailySales: {
              $sum: '$totalprice',
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
  
      return dailySalesData;
    } catch (error) {
      throw error;
     
    }
  }
  
  async function calculateOrderCountByDate() {
    try {
      const orderCountData = await Order.aggregate([
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$orderDate',
              },
            },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
  
      return orderCountData;
    } catch (error) {
      throw error;
    }
  }
  
  async function calculateProductsCount() {
    try {
      const productCount = await Product.countDocuments();
  
      return productCount;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function calculateOnlineOrderCountAndTotal() {
    try {
      const onlineOrderData = await Order.aggregate([
        {
          $match: {
            paymentmethod: 'online',
            orderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$totalprice' },
            count: { $sum: 1 },
          },
        },
      ]);
  
      return onlineOrderData;
    } catch (error) {
      throw error;
    }
  }
  
  
  async function calculateCodOrderCountAndTotal() {
    try {
      const codOrderData = await Order.aggregate([
        {
          $match: {
            paymentmethod: 'cod',
            orderStatus: 'Delivered',
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$totalprice' },
            count: { $sum: 1 },
          },
        },
      ]);
  
      return codOrderData;
    } catch (error) {
      throw error;
    }
  }
  
  
  
  async function getLatestOrders() {
    try {
      const latestOrders = await Order.aggregate([
        {
          $unwind: '$products',
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $addFields: {
            username: {
              $arrayElemAt: ['$userDetails.name', 0],
            },
            address: {
              $arrayElemAt: ['$userDetails.address.name', 0],
            },
          },
        },
        {
          $project: {
            userDetails: 0,
          },
        },
      ]);
  
      return latestOrders;
    } catch (error) {
      throw error;
    }
  }
  
  
  
  
  async function calculateListedCategoryCount() {
    try {
      const listedCategoryCount = await Category.countDocuments({ active: true });
  
      return listedCategoryCount;
    } catch (error) {
      throw error;
    }
  }
  
  
  
  const   loaddashboard = async (req, res) => {
    try {
     
      const ordersData = await calculateDeliveredOrderTotal()
      console.log(ordersData,"get dashBorde rsData")
      const orders = ordersData[0]
      console.log(orders,"get dashBordorders")
      const categorySales = await calculateCategorySales()
      console.log(categorySales,"get dashBorders categorySales")
      const salesData = await calculateDailySales()
      console.log(salesData,"get dashBorders  salesData")
      const salesCount = await calculateOrderCountByDate()
      
      console.log(salesCount,"get dashBordersData salesCount")
      const categoryCount = await calculateListedCategoryCount()
      

      console.log(categoryCount ,"get dashBorders categoryCount ")
      const productsCount = await calculateProductsCount()
        
      console.log(productsCount,"get dashBorders productsCount")
      const onlinePay = await calculateOnlineOrderCountAndTotal()
      console.log(onlinePay,"get dashBord onlinePay")
      const codPay = await calculateCodOrderCountAndTotal()
      
      console.log(codPay,"get dashBord codPay")
      const latestorders = await getLatestOrders()

         console.log(latestorders,"get dashBord latestorders")
         console.log("productsCount:", productsCount);
         console.log("categoryCount:", categoryCount);
        console.log("onlinePay.totalPriceSum:", onlinePay[0]?.totalPriceSum);
        console.log("onlinePay.count:", onlinePay[0]?.count);
      // console.log('uasername', latestorders)
  
      res.render('dashboard', {
        orders, productsCount, categoryCount,
        onlinePay: onlinePay[0], salesData, order: latestorders, salesCount,
        codPay: codPay[0], categorySales
      })
  
    }
    catch (error) {
     console.log(error.message)
    }
  
  }
  const  addrefferalmoneypag = async(req,res)=>{
    try {
      res.render("referraloffer")
    }
    catch (error) {
    console.log(error.message);
    }
  }
  const  addrefferalmoney = async(req,res)=>{
    try {
      const refferamout = req.body.referral_offer
       const referraldata = await Referraloffer.find()
      let id
      if(referraldata.length === 0){
       
      const referral = new Referraloffer({
        Offeramout:refferamout,
      
      })
   
     const refferaldata =  await referral.save()
     
     
     
      
    }else{
      const refferaldata =referraldata[0]
      console.log(refferamout);
      console.log(refferaldata._id);
      const updateOffer = await Referraloffer.findByIdAndUpdate({_id:referraldata._id},{$set:{Offeramout:refferamout}})
    }
   
      res.render("referraloffer",{message:"referral offer is succesfully added"})
    }
    catch (error) {
    console.log(error.message);
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
    Logout,
    addrefferalmoneypag,
    loaddashboard,
    addrefferalmoney

    
}