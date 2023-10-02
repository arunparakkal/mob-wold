 const User = require("../model/userModel")
 const adminHelper = require("../helper/adminHelper")
const loadLogin = async(req,res)=>{
    try{
        res.render("login")
    }
    catch(error){
        console.log(error.message);
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


module.exports = {
    loadLogin,
    verifyLogin ,
    loadUser,
    blockUser,
    unblockUser,
    
}