const Product = require('../model/product')
const Category = require("../model/categoryModel")
const cropImage = require('../multer/productimageCrop')
const product = require('../model/product')
const { findOne, updateOne } = require('../model/refferalmoney')


const addProduct = async (req, res) => {
    try {
        const categories = await Category.find()

        res.render("product", { categories })
    }
    catch (error) {
        console.log(error.message);
    }
}
const createProducts = async (req, res) => {
    try {

        const { productname, categoryname, description, quantity, color, Productprice, Salesprice } = req.body;

        const categories = await Category.findOne({ categoryname: categoryname }).lean()


        const productprice = Productprice
        let specialOffer = 0;
        if (categories.offer < Salesprice) {

            specialOffer = Salesprice

        } else {
            specialOffer = categories.offer

        }


        const discount = (Productprice * specialOffer) / 100
        const salesprice = Productprice - discount

        console.log('priceeee', salesprice);


        console.log(productprice);


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

        const products = await Product.find()

        res.redirect('products')
    } catch (error) {

        console.log(error.message);
    }
}
const products = async (req, res) => {
    try {

        const products = await Product.find()

        res.render('productList', { products })
    } catch (error) {
        console.log(error.message)
    }
}
const productDetail = async (req, res) => {
    try {

        const productId = req.query.products;

        const product = await Product.findById(productId)

        res.render('users/productdetail', { product, user: req.session.user_id })

    } catch (error) {
        console.log(error.message)
    }
}
const getEditproductPage = async (req, res) => {
    try {
        const categories = await Category.find();
        const productData = await Product.findOne({ _id: req.query.productId });



        res.render("editproducts", { categories, productData })
    }
    catch (error) {
        console.log(error.message);
    }
}

const editUpdateProduct = async (req, res) => {
    try {

        const { categoryname, description, quantity, color } = req.body
        const productname = req.body.productname.trim()
        const productprice = req.body.Productprice
        const salesprice = req.body.Salesprice
        const productId = req.body.productId



        if (req.files.length != 0) {
            const images = req.files.map(file => file.filename);
            const productData = await Product.findOne({ _id: req.body.productId })
            if (productData.image.length < 4) {

                for (let i = 0; i < images.length; i++) {
                    productData.image.push(images[i])
                    if (productData.image.length == 4) {
                        break
                    }
                }
                await productData.save()
            }
            await Product.updateOne({ _id: req.body.productId }, { $set: { productname, categoryname, description, quantity, color, productprice, salesprice } })
        } else {

            await Product.updateOne({ _id: req.body.productId }, { $set: { productname, categoryname, description, quantity, color, productprice, salesprice } })
        }

        res.redirect("/admin/products")
    }
    catch (error) {
        console.log(error.message);
    }
}
const deteEditeproduct = async (req, res) => {
    try {
        const productId = req.body.productId
        const removeindex = req.body.index

        const findProduct = await Product.findOne({ _id: productId })
        if (!findProduct) {
            res.status(404).send('Product not found');
        } else {
            findProduct.image.splice(removeindex, 1)
            findProduct.save()

            res.status(200).json({ message: 'Product image deleted successfully', product: findProduct });
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const unlistproduct = async (req, res) => {
    try {
        const productId = req.query.productId
        
        const productUpdate = await Product.updateOne({ _id: productId }, { $set: { isListed: false } })
      
         res.redirect("/admin/products")
    }
    catch (error) {
        console.log(error.message);
    }
}
const listproduct = async (req, res) => {
    try {
        const productId = req.query.productId
        
        
        const productUpdate = await Product.updateOne({ _id: productId }, { $set: { isListed: true } })
        console.log("productupdat",productUpdate);
         res.redirect("/admin/products")
    }
    catch (error) {
        console.log(error.message);
    }
}


module.exports = { addProduct, createProducts, products, productDetail, getEditproductPage, editUpdateProduct, deteEditeproduct, unlistproduct,listproduct }