const express = require("express")
const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const session = require("express-session")
const Category = require("../model/categoryModel")
module.exports = {
    verifyloagin: async(req,res)=>{
        try{
            
            const email = req.body.email
            const password = req.body.password
            const userData =  await User.findOne({email:email})
            console.log("admindata",userData);
            if(userData){
                const passwordMatch = await bcrypt.compare(password,userData.password)
                console.log("passwordmatch",passwordMatch);
                if(passwordMatch){
                     if(userData.is_admin == 0){
                        res.render("login",{message:"Admin not verified please verify the admin"})
                     }else{

                        req.session.user_id = userData._id
                        res.redirect('dashboard')
                     }
                }else{
                    res.render("login",{message:"password is incorrect"})
                }
            }else{
                res.render("login",{message:"email is incorrect"})
            }
        }
        catch(error){
            console.log(error.message);
        }
    },
    blockuser: async(req,res)=>{
        try{
            const userId = req.query.id
         
            const updateUser = await User.updateOne({_id:userId },{$set:{is_block:true}})
            res.redirect("userlist")
        }
        catch(error){
            console.log(error.message);
        }
    },
    unblockuser: async(req,res)=>{
        try{
            const userId = req.query.id
            
            const updateUser = await User.updateOne({_id:userId },{$set:{is_block:false }})
            res.redirect("userlist")
        }
        catch(error){
            console.log(error.message);
        }
    },
  
}