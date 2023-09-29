const Product = require('../model/product')
const Category = require("../model/categoryModel")
const cropImage = require('../multer/productimageCrop')
const product = require('../model/product')


const addProduct =  async(req,res)=>{
    try{
       const categories = await Category.find()
       
        res.render("product",{categories})
    } 
    catch(error){
        console.log(error.message);
    }
} 
const createProduct = async(req, res)=>{
    try{
        const { productname, categoryname, description, quantity, color, productprice, salesprice } = req.body;
        
        await cropImage.crop(req); 
        const images = req.files.map(file => file.filename);
        const productadd = new Product({
            productname,
            categoryname,
            description,
            quantity,
            color,
            productprice,
            salesprice,
            image: images,
            isListed: true
            
        });
        const saveProduct = await productadd.save();
        console.log("product added successfully");

        // const categories = await Category.find().lean()
        const products = await Product.find()
        
        res.render('productList',{products})
    }catch(error){
        
        console.log(error.message);
    }
}
const products = async(req, res)=>{
    try{
       
        const products = await Product.find()
       
        res.render('productList',{products})
    }catch(error){
        console.log(error.message)
    }
}
const productDetail = async(req, res)=>{
    try{
   
       const productId = req.query.products;
       
        const product = await Product.findById(productId)
        
        res.render('users/productdetail',{product})

    }catch(error){
        console.log(error.message)
    }
}

module.exports = {addProduct,createProduct,products,productDetail}