const bcrypt = require("bcrypt")
const User = require("../model/userModel")
const randomString = require("randomstring")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const express = require("express")
const session = require("express-session")



const userRoute = require("../route/userRoute")

const objj = {}
module.exports = {

   
    //otp loader
    

    //password decryption
    passwordHash: async(password)=>{
        try{
            hashedPassword = await bcrypt.hash(password,10)
            return hashedPassword

        }
        catch(Error){
            console.log(Error.message);
        }
    },

    //mail verification 
    sendVerifyMail: async(name,email,otp)=>{
        try{
            const transporter = nodemailer.createTransport({
                host:"smtp.gmail.com",
                port:587,
                secure:false,
                requireTLS:true,
                auth:{
                    user:"arunaru0034@gmail.com",
                    pass:"mlfxkmzrmyauvbml"
                }
            }) 
            const mailOption = {
                from:"arunaru0034@gmail.com",
                to:email,
                subject:"For verification mail",
                html:'<p>Hyy '+name+" "+"this is your verify opt " +"  "+  otp+' "</p>'
                
            }
            transporter.sendMail(mailOption,function(error,info){
                if(error){

                }else{
                    console.log("Email has been send :-" ,info.response);
                }
            })
            
        }
        catch(error){
            console.log(error.message);
        }
    },

    // sign up page loader
    

    // new user

    

    //verify otp

   
    varifylogin: async(req,res)=>{
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
                
                req.session.user_Id = userData._id
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
   
}   