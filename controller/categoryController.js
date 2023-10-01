const categoryHelper = require("../helper/categoryHelper");
const Category = require("../model/categoryModel");

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
        const userId = req.query.userId;       
        const category = await Category.findOne({_id:userId})
        res.render("editcategory",{category,userId})
    }
    catch(error){
        console.log(error.message);
    }
}
const updateCategory = async(req,res)=>{
    try{
       const {categoryname,description} = req.body
       const userId = req.body.userId;
      if(req.file){
        const image = req.file.filename
        const updateCategory = await Category.findOneAndUpdate({_id:userId},{$set:{categoryname:categoryname,description:description,image:image}})
      }else{
        const updateCategory = await Category.findOneAndUpdate({_id:userId},{$set:{categoryname:categoryname,description:description}})
      }
      res.redirect("/admin/category")
    }
    catch(error){
        console.log(error.message);
    }
    
}
module.exports = {loadCategory, addCategory,editCategory,updateCategory}