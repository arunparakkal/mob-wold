const Category = require("../model/categoryModel");
const cropImage = require("../multer/categoryimagecrop")
module.exports = {

    loadcategory: async(req,res)=>{ try{
        const categories = await Category.find()
    
        res.render("category",{categories})
    }
    catch(error){
        console.log(error.message);
    }
},
addcategory: async(req,res, err)=>{
    try{
        
        await cropImage.crop(req)
        console.log("croped sucss");
       const image = req.file.filename
       
       const newCategory = new Category({
        categoryname:req.body.categoryname,
        description:req.body.description,
        image:image
       })
       
       const saveCategory = await newCategory.save()
    
       res.redirect("/admin/category")
    }
    catch(error){
        console.log("error catch");
        if (error instanceof multer.MulterError) {
            // Render the category page with an error message
            return res.render('category', { error: 'Invalid file type. Only images are allowed.' });
          }
      
          // Handle other errors as needed
          res.status(500).send('Internal server error');
    }
}
}