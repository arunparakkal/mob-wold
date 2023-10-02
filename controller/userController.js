
const userHelper = require("../helper/userHelper")
const User = require("../model/userModel");
const product = require("../model/product");
const bcrypt = require("bcrypt")
const Address = require("../model/addressModel")
const Cart = require('../model/cartModel')
const randomString = require("randomstring")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const express = require("express")
const session = require("express-session")



//load home
const LoadHome = async(req,res)=>{
    try{
        
        res.render("users/home.ejs");

    }
    catch(Error){
        console.log(Error.message);
    }
}
const Logout = async(req,res)=>{
    try{ 
     delete req.session.user_id
         res.redirect("/")

    }
    catch(Error){
        console.log(Error.message);
    }
}
const LoadHomee = async(req,res)=>{
    try{ 
        
  
        const Id = req.session.user_id
       
         const userData = await User.findOne({_id:Id});
        
       
        
        res.render("users/home",{user:req.session.user_id});

    }
    catch(Error){
        console.log(Error.message);
    }
}

// signup page
const loadsignUp = async(req,res)=>{
    try{
    await userHelper.loadingsinup(req,res)
    }
    catch(error){
        console.log(error.message)
       
    }
}

//user insert
const inserUser = async(req,res)=>{
    try{
        
        await userHelper.insertuser(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}
const recentOpt = async(req,res)=>{
    try{
        
        await userHelper.recentopt(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}

//otp page loader
const otppage = async (req, res) => {
  try{
    
   await userHelper.loadOtp(req,res)
  
  }
  catch(error){
    console.log(error.message);
  }
}

//otp verification
const VerifyOtp = async(req,res)=>{
    try{
      
        await userHelper.Verifyotp(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}

//user verification

const loadLogin = async(req,res)=>{
    try{
        await userHelper.loadlogin(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}


const verifyLogin = async(req,res)=>{
    try{
       
        const email = req.body.email
        const password = req.body.password
       
        const userData = await User.findOne({email:email})
        
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
               if(userData.is_verified == 0){
                res.render("users/login",{message:"user not verified please verify"})
               }else{
               
                req.session.user_id = userData._id
             
                req.session.isLoggedIn = true;
              
                res.redirect("/home")
               }
            }else
            {
                res.render("users/login",{message:"password is incorrect"})
            }
        }else{
            res.render("users/login",{message:"your Email is incorrect"})
        }
       }
       catch(error){
        console.log(error.message)
       }
    
}
const loadShop = async(req,res)=>{
    try{
        const products = await product.find()
        res.render("users/shop",{products,user:req.session.user_id})
    }
    catch(error){
        console.log(error.message);
    }
}
const loadprofile = async(req,res)=>{
    try{
         
        
        const userData = await User.findOne({_id:req.session.user_id})
       
 res.render("users/profile",{user:userData})
    }
    catch(error){
        console.log(error.message);
    }
}
const editProfile = async(req,res)=>{
    try{
        const userData = await User.findOne({_id:req.query.user})
        res.render("users/editprofile",{userData})
    }
    catch(error){
        console.log(error.message);
    }
}
const updateUser = async(req,res)=>{
    try{
        
      const {name,email,mobile} = req.body
      
       if(req.file){
        const image = req.file.filename
      const updateUser = await User.findOneAndUpdate({_id:req.body.userId},{$set:{name:name,email:email,mobile:mobile,image:image}})
      
       }else{
        const updateUser = await User.findOneAndUpdate({_id:req.body.userId},{$set:{name:name,email:email,mobile:mobile}})
        
       }
       res.redirect("/profile")
    }
    catch(error){
        console.log(error.message);
    }
}
const LoadAddress = async(req,res)=>{
    try{
        res.render("users/address",{user:req.session.userId})
    }
    catch(error){
        console.log(error.message);
    }
}
const   insertData = async(req,res)=>{
    try{
       
        const {name,mobile,address1,address2,state,postalCode, country} = req.body
        const userAddress = await Address.findOne({userId:req.session.user_id})
       const address ={
        
            Name:name,
            Number: mobile,
            addressLine1: address1,
            addressLine2:address2,
            state:state,
            postalCode :postalCode,
            country:country

          }
    
       if(!userAddress || (userAddress && userAddress.addresses.length < 1)){
        const newAddress = new Address({
            userId:req.session.user_id,
            addresses:address
          

        })
        const addresData = await newAddress.save()

       }else{
        userAddress.addresses.push(address)
        userAddress.save()
       }
       if(req.body.add == "scre" ){
      
        res.redirect("/checkout")
       }else{
        res.redirect("/address")
       }
    }
    catch(error){
        console.log(error.message);
    }
}

const LoadAllAddress = async(req,res)=>{
    try{
     
        const addresData = await Address.findOne({userId:req.session.user_id})
    
   
        res.render('users/addresses',{addresData,user:req.session.user_id})
        

    }catch(error){
        console.log(error.message);
    }
}
const LoadCart = async(req,res)=>{
    try{
        const cart = await Cart.findOne({userId:req.session.user_id}).populate('products.productId')
       
        res.render("users/cart",{cart,user:req.session.user_id})
    }
    catch(error){
        console.log(error.message);
    }
}
const AddtoCart = async(req,res)=>{
    try{
        const {productId,quantity}= req.body
      
       const productData = await product.findOne({_id:req.body.productId})
       
      
       let cart = await Cart.findOne({userId:req.session.user_id})
     
       if(!cart){
        cart = new Cart({userId:req.session.user_id})
       }

      const productIndex = cart.products.findIndex((product)=>{

             
        return product.productId.toString() === productId

       })
      

       if(productIndex !== -1){
        cart.products[productIndex].quantity+=quantity
        cart.products[productIndex].subTotal =
        cart.products[productIndex].price * cart.products[productIndex].quantity
      
       }else{
     
        cart.products.push({
            productId,
            quantity,
            price:productData.salesprice,
            subTotal:productData.salesprice
        })     
     }
      
     cart.cartSubtotal = cart.products.reduce((total,product)=>{
        return total + product.quantity * product.price
     },0)
     cart.cartTotal = cart.products.reduce((total,product)=>{
        return total + product.quantity * product.price
     },0)
    
     const newCart = await cart.save()

     res.json(newCart) 


       
    }
    catch(error){
        console.log(error.message);
    }
}
const Checkout = async(req,res)=>{
    try{
        const sec = "scre"
        
       res.render("users/checkout",{sec,user:req.session.user_id})
        
    }
    catch(error){
        console.log(error.message);
    }
}
const Default = async(req,res)=>{
    try{
        const addId = req.query.addressId
        const user = await Address.findOne({userId:req.session.user_id})  
        if(!user){
            console.log("user not login");
            res.render('users/login')
        }
        user.addresses = user.addresses.map((val)=>{
            val.isDefault = false
            return val
            })
      const updateData = user.addresses.find((add)=>{
    
        return  add._id.toString() === addId
      })
   
    updateData.isDefault = true   
    await user.save()
       res.redirect('/addresses')
    }
    catch(error){
        console.log(error.message)
    }
} 

module.exports = {
LoadHome,
loadsignUp,
inserUser,
otppage,VerifyOtp,loadLogin,verifyLogin,LoadHomee,loadShop,Logout,loadprofile,editProfile,updateUser,LoadAddress,insertData,LoadAllAddress,LoadCart,AddtoCart,recentOpt,Checkout,Default

}