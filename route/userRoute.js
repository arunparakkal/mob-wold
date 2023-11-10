const express = require("express")
const userRoute = express()

const multer = require('multer');
const path = require('path');
const nocache = require('nocache')
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
userRoute.use(nocache())

userRoute.use(express.json())
userRoute.use(express.urlencoded({extended:true}))

const session = require("express-session")
userRoute.use(session({
    secret:process.env.SESSION_SECRETE,
    resave:true,
    saveUninitialized:false,

}))



const UserController = require("../controller/userControllerr")
const ProductController = require('../controller/productControllerr')
const couponController = require('../controller/couponController')
const auth = require("../middleWare/auth")

userRoute.get("/",auth.isLogout,UserController.LoadHome)
userRoute.get("/home",auth.isLogin,UserController.LoadHomee)
userRoute.post("/home",auth.isLogout,UserController.verifyLogin)

userRoute.get("/login",auth.isLogout,UserController.loadLogin)
userRoute.post("/verifyotp",auth.isLogin,UserController.VerifyOtp)
userRoute.get('/otp',auth.isLogout,UserController.otppage)
userRoute.get("/logout",auth.isLogin,UserController.Logout)

userRoute.get("/register",auth.isLogout,UserController.loadsignUp)
userRoute.post("/register",UserController.inserUser)
userRoute.get("/recentopt",auth.isLogout,UserController.recentOpt)

userRoute.get("/shop",auth.isLogin,UserController.loadShop)
userRoute.get('/productdetail',auth.isLogin,ProductController.productDetail)
userRoute.get("/profile",auth.isLogin,UserController.loadprofile)
userRoute.get("/editprofile",auth.isLogin,UserController.editProfile)
userRoute.post("/update",upload.single("image"),UserController.updateUser)
userRoute.get("/address",auth.isLogin,UserController.LoadAddress)
userRoute.post("/address",auth.isLogin,UserController.insertData)
userRoute.get('/addresses',auth.isLogin,UserController.LoadAllAddress)

userRoute.get("/cart",auth.isLogin,UserController.LoadCart)
userRoute.post("/addtocart",auth.isLogin,UserController.AddtoCart)
userRoute.post('/cart-quantity',auth.isLogin,UserController.cartQuantity)
userRoute.delete("/category_remove/:itemId",auth.isLogin,UserController.RemoveCart)

userRoute.get("/checkoutaddadress",auth.isLogin,UserController.Checkoutaddress)
userRoute.get("/checkout",UserController.Checkout)
userRoute.get("/default",auth.isLogin,UserController.Default)
userRoute.get("/changepassword",auth.isLogin,UserController.Changepassword)
userRoute.post("/changepassword",auth.isLogin,UserController.addPassword)
userRoute.post("/placeorder",auth.isLogin,UserController.placeOrder)
userRoute.get("/orderlist",auth.isLogin,UserController.listOrder)
userRoute.get("/orderdetail/:orderId",auth.isLogin,UserController.orderdetail)
userRoute.post('/verifyPayment',auth.isLogin,UserController.verifyRazorpayPayment)

userRoute.get('/coupons',auth.isLogin,couponController.couponGet)
userRoute.post('/couponget',auth.isLogin,couponController.applyCoupon)
userRoute.post('/ordercancel',auth.isLogin,UserController.cancelOrder)
userRoute.post('/orderReturn',auth.isLogin,UserController.returnOrder)
userRoute.get('/forgotpassword',auth.isLogout,UserController.Foregetpassword)
userRoute.post('/forgotverify',auth.isLogout,UserController.Foregotverify)
userRoute.get('/forgot-password',auth.isLogout,UserController.ForegotpasswordLoad)
userRoute.post('/forgot-password',UserController.resetpassword)

userRoute.post("/walletrecharge",auth.isLogin,UserController.Walletrecharge)
userRoute.get("/wallethistory",auth.isLogin,UserController.walletHistory)
userRoute.get("/404-page",auth.isLogin,UserController.errorpage)





module.exports = userRoute
