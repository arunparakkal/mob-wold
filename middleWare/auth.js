const User = require("../model/userModel")
const mongoose = require("mongoose")

const isLogin = async(req,res,next)=>{
    try{

        if(req.session&&req.session.user_id ){
            
            const userData = await User.findOne({_id:req.session.user_id})

            
            if(userData.is_block){
              
               return res.render("users/login",{message:"Your blocked by admin pleasse contact admin"})
            }
          
            next()
        }else{
             
             res.render("users/home")
            next()
   
        }
    }
    catch(error){
        console.log(error.message)
    }
}
const isLogout = async(req,res,next)=>{
    try{
       
        if(req.session.user_id){

            res.redirect("/home")  
            
        }else{
        next()
       

        }
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports = {isLogin,isLogout}