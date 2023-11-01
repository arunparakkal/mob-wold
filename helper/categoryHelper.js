const Category = require("../model/categoryModel");
const cropImage = require("../multer/categoryimagecrop")
module.exports = {

    loadcategory: async(req,res)=>{ try{
        const userId = req.query.id
         const categories = await Category.find()
        res.render("category",{categories, userId})
    }
    catch(error){
        console.log(error.message);
    }
},
addcategory: async(req,res)=>{
    try{
        
        await cropImage.crop(req)
        console.log("croped sucss");
       const image = req.file.filename
      
       const newCategory = new Category({
        categoryname:req.body.categoryname,
        description:req.body.description,
        image:image,
        offer:req.body.offer
       })
       
       const saveCategory = await newCategory.save()
       const userId = saveCategory._id;
       res.redirect(`/admin/category?id=${userId}`)
    }
    catch(error){
        console.log(error.message);
    }
}
}