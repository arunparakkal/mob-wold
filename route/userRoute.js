const express = require("express")
const userRoute = express()

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/userProfile');
    },filename:(req, file, cb) =>{
        // console.log('data file getting')
    const originalname = file.originalname;
    const extname = path.extname(originalname);
    const basename = path.basename(originalname);
    const filename = `${Date.now()}-${basename}${extname}`;
    
    cb(null, filename);
    }
})
const upload = multer({storage})

userRoute.use(express.json())
userRoute.use(express.urlencoded({extended:true}))

const session = require("express-session")
userRoute.use(session({
    secret:process.env.SESSION_SECRETE,
    resave:true,
    saveUninitialized:false,

}))



const UserController = require("../controller/userController")
const ProductController = require('../controller/productController')
const auth = require("../middleWare/auth")

userRoute.get("/",auth.isLogout,UserController.LoadHome)
userRoute.get("/home",auth.isLogin,UserController.LoadHomee)
userRoute.post("/home",UserController.verifyLogin)
userRoute.get("/logout",auth.isLogin,UserController.Logout)
userRoute.get("/register",UserController.loadsignUp)
userRoute.post("/register",UserController.inserUser)
userRoute.get("/recentopt",UserController.recentOpt)
userRoute.get('/otp',UserController.otppage)
userRoute.post("/userRoute",UserController.VerifyOtp)
userRoute.get("/login",UserController.loadLogin)
userRoute.get("/shop",UserController.loadShop)
userRoute.get('/productdetail',ProductController.productDetail)
userRoute.get("/profile",UserController.loadprofile)
userRoute.get("/editprofile",UserController.editProfile)
userRoute.post("/update",upload.single("image"),UserController.updateUser)
userRoute.get("/address",UserController.LoadAddress)
userRoute.post("/address",UserController.insertData)
userRoute.get('/addresses',auth.isLogin,UserController.LoadAllAddress)
userRoute.get("/cart",UserController.LoadCart)
userRoute.post("/addtocart",UserController.AddtoCart)
userRoute.get("/checkout",UserController.Checkout)
userRoute.get("/default",UserController.Default)
module.exports = userRoute
