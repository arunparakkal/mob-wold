const User = require("../model/userModel")
const mongoose = require("mongoose")

const isLogin = async(req,res,next)=>{
    try{

        if(req.session&&req.session.admin_id ){
                      
            next()
            
        }else{
            
              res.redirect("login")
            next()
   
        }
    }
    catch(error){
        console.log(error.message)
    }
}
const isLogout = async(req,res,next)=>{
    try{
       
        if(req.session.admin_id){

          res.redirect("dashboard")
          
            
        }else{
        next()
   
        }
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports = {isLogin,isLogout}