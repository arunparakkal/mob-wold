const categoryHelper = require("../helper/categoryHelper");


const loadCategory = async(req,res)=>{
    try{
        await categoryHelper.loadcategory(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}
const addCategory = async(req,res)=>{
    try{
        await categoryHelper.addcategory(req,res)
    }
    catch(error){
        console.log(error.message);
    }
}
const editCategory = async(req,res)=>{
    try{
        
        res.render("editcategory")
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports = {loadCategory, addCategory,editCategory}