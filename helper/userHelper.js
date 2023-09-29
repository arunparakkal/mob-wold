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
    loadOtp: async(req,res)=>{
        try{
         
            res.render("users/otp",{userId:req.query.id})
        }
        catch(error){
            console.log(error.message);
        }
    },

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
    loadingsinup: async(req,res)=>{
        try{
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.render("users/siginup")
        }
        catch(error){
            console.log(error.message);
        }
    },

    // new user
    insertuser: async(req,res)=>{
        try{          
            const Spassword = await module.exports.passwordHash(req.body.password)   
            // const existEmail = await User.findOne({ email: req.body.email });
            // if (existEmail) {
            //   return res.render("users/siginup",{ message: "Email already exists." });
            // }
            console.log(" im in");
            const user= new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                password:Spassword,
                is_admin:0

            })
            const userData = await user.save()

           if(userData){
            const otp = randomString.generate({length:4,charset:"numeric"})
           objj.OTP = otp
          console.log(objj.OTP)
           await module.exports.sendVerifyMail(req.body.name,req.body.email,otp)
           res.redirect(`/otp?id=${userData._id} `); 
           }
           else{
            res.render("siginup",{message:"your registerarion Failed"})
           }
        }
        catch(error){
            console.log(error.message);
        }
    },
    recentopt: async(req,res)=>{
        try{           
           const userId = req.query.userId.trim(); 
            const otp = randomString.generate({length:4,charset:"numeric"})
           objj.OTP = otp
           console.log("recent",objj.OTP); 
           await module.exports.sendVerifyMail(req.body.name,req.body.email,otp)
           const userData = await User.findOne({ _id: userId });
           res.redirect(`otp?id=${userData._id}`); 
        }
        catch(error){
            console.log(error.message);
        }
    },

    //verify otp
    Verifyotp: async(req,res)=>{
        try{
            const formdata = req.body.otp1
            console.log("Received form data:", formdata);
            const otp1 = req.body.otp1;
            const otp2 = req.body.otp2;
            const otp3 = req.body.otp3;
            const otp4 = req.body.otp4;
            const Newopt =otp1+otp2+otp3+otp4
            console.log("newOtp :-" ,Newopt);
            
          
            if(objj.OTP === Newopt){
                delete objj.OTP
                const id = req.body.userId.trim()
        
              const udpateinfo = await User.updateOne({_id:id} , {$set:{is_verified:1}})
              console.log(udpateinfo);
             
               res.redirect("/")
            }
        }
        catch(error){
            console.log(error.message);
        }
    },
    loadlogin: async(req,res)=>{
        try{
            res.render("users/login")
        }
        catch(error){
            error.message
        }
    },
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