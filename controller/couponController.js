const mongoose = require('mongoose');
const Coupon = require('../model/couponModel')

const couponList = async (req, res) => {
    try {
  
        const coupons = await Coupon.find()
      res.render("addCoupon",{coupons});
    } catch (error) {
      console.log(error.message)
    }
  }
 
  const coupons = async (req, res) => {
    try {
        // console.log('couponlist function')
        const coupons = await Coupon.find()
      res.render("coupons",{coupons});
    } catch (error) {
      console.log(error.message)
    }
  }
 

const addCoupon = async(req, res) => {
  try {  
   
      const { couponCode, description, discount, maxDiscount, minAmount, expirationDate } = req.body;
     const existCoupons = await Coupon.find({couponCode:couponCode})
     console.log("coup",existCoupons.length);
     if(existCoupons.length !== 0){
    return   res.status(400).json({  error: 'coupon is already exist' });
     }
    
     if(existCoupons){
     
     
     }
      const newCoupon = new Coupon({
          couponCode,
          description,
          discount,
          maxDiscount,
          minAmount,
          expirationDate,
          isListed: true
      });
      await newCoupon.save();
      
      res.json({ message: 'Coupon added successfully' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

const editCouponPage = async(req, res)=>{
  try {
   
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).render('error', { message: 'Coupon not found' });
    }
    res.render('editCoupon', { coupon });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
}

const editCoupon =async(req, res)=>{
  try{
    
    const couponId = req.params.id;
    const updates = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId,updates)
 
    if(updatedCoupon){
      return res.json({success: true})
    }else{
      return res.status(400).json('error',{message: 'Coupon not found'})
    }
  }catch(error){
    console.error(err);
    return res.status(500).json({error: "internal server error"})
  }
}
const listCoupon = async (req, res) => {
  try {
    const couponId = req.body.couponId;
    const validCouponId = new mongoose.Types.ObjectId(couponId);
    const coupons = await Coupon.findByIdAndUpdate(validCouponId, { isListed: true });
    console.log('Coupon updated', coupons);

    res.redirect('coupons');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');    
  }
};

const unListCoupon = async (req, res) => {
  try {
    const couponId = req.body.couponId;
    const validCouponId = new mongoose.Types.ObjectId(couponId);
    const coupons = await Coupon.findByIdAndUpdate(validCouponId, { isListed: false });
    console.log('Coupon updated', coupons);

    res.redirect('coupons');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};
const couponGet = async (req, res) => {
  try {

      const calculateTotalPrice = req.session.calculateTotalPrice;
      console.log('ca',calculateTotalPrice)
      const currentDate = new Date();
      const coupons = await Coupon.find({
          isListed: true,
          expirationDate: { $gte: currentDate }
      });
      res.render('users/couponsGet', { coupons, calculateTotalPrice })
  } catch (error) {
     console.log(error.message)
  }
}
const applyCoupon = async (req, res) => {
  try {
      if (req.session.user_id) {
          const  {couponCode} = req.body;
         
          const coupon = await Coupon.findOne({ couponCode: couponCode });
         
          if (coupon) {
              res.json({ success: true, couponCode: coupon.couponCode });
          } else {
              res.status(404).json({ success: false, error: 'Coupon not found' });
          }
      } else {
          res.status(401).json({ success: false, error: 'User not logged in' });
      }
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, error: 'Server error' });
  }
};
  module.exports = {
    couponList,
    addCoupon,
    coupons,
    editCouponPage,
    editCoupon,
    unListCoupon,
    listCoupon,
    applyCoupon,
    couponGet
   
  }