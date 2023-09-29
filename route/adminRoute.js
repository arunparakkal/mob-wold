const express = require("express")
const admin_route = express()


const session = require("express-session")
admin_route.use(session({
    secret:process.env.SESSION_SECRETE,
    resave:true,
    saveUninitialized:false,

}))
const bodyparser = require("body-parser")
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))

admin_route.set("view engine","ejs")
admin_route.set("views","./views/admin")

const adminController = require("../controller/adminController")
const auth = require("../middleWare/auth")
const categoryController = require("../controller/categoryController")
const categoryUpload = require("../multer/category")
const productController = require("../controller/productController")
const uploadProduct = require("../multer/product")

admin_route.get("/login",adminController.loadLogin)
admin_route.post("/login" , adminController.verifyLogin)
admin_route.get("/userlist",adminController.loadUser)

 admin_route.get("/block",adminController.blockUser)
 admin_route.get("/unblock",adminController.unblockUser)
 admin_route.get("/category",categoryController.loadCategory)
 admin_route.post("/addcategory",categoryUpload.single("file"),categoryController.addCategory)
 admin_route.get("/editcategory",categoryController.editCategory)
 admin_route.get("/addproduct",productController.addProduct)
 admin_route.post("/addproduct",uploadProduct.array("file"),productController.createProduct)
 admin_route.get("/products",productController.products)
module.exports = admin_route