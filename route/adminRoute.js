const express = require("express")
const admin_route = express()


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/uploadCategory');
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

const auth = require("../middleWare/adminauth")
const adminController = require("../controller/adminController")
const categoryController = require("../controller/categoryController")
const categoryUpload = require("../multer/category")
const productController = require("../controller/productControllerr")
const couponController = require('../controller/couponController')
const uploadProduct = require("../multer/product")
 const dashBoardReportController = require("../controller/dashboardController")

admin_route.get("/login",auth.isLogout,adminController.loadLogin)
admin_route.get("/dashboard",auth.isLogin, adminController.loaddashboard)
admin_route.post("/home" ,auth.isLogout, adminController.verifyLogin)
admin_route.get("/userlist",auth.isLogin,adminController.loadUser)
admin_route.get("/logout",auth.isLogin,adminController.Logout)


admin_route.get("/block",auth.isLogin,adminController.blockUser)
admin_route.get("/unblock",auth.isLogin,adminController.unblockUser)
admin_route.get("/category",auth.isLogin,categoryController.loadCategory)
admin_route.post("/addcategory",upload.single("file"),categoryController.addCategory)
admin_route.get("/editcategory",auth.isLogin,categoryController.editCategory)


admin_route.post("/editcategory",upload.single("image"),categoryController.updateCategory)
admin_route.get("/addproduct",auth.isLogin,productController.addProduct)
admin_route.post("/addproduct",uploadProduct.array("file"),productController.createProducts)
admin_route.get("/products",auth.isLogin,productController.products)
admin_route.get("/list",auth.isLogin,categoryController.List)
admin_route.get("/unlist",auth.isLogin,categoryController.Unlist)

admin_route.get('/couponCreate',auth.isLogin,couponController.couponCreate)
admin_route.get('/coupons',auth.isLogin,couponController.coupons)
admin_route.post('/addCoupon',auth.isLogin,couponController.addCoupon)
admin_route.get('/edit-coupon/:id',auth.isLogin,couponController.editCouponPage)
admin_route.post('/editcoupon/:id',auth.isLogin,couponController.editCoupon)
admin_route.post('/unListCoupon', auth.isLogin,couponController.unListCoupon);
admin_route.post('/listCoupon', auth.isLogin,couponController.listCoupon);



admin_route.get('/orders',auth.isLogin,adminController.orderListing)
admin_route.get('/order/:orderId',auth.isLogin,adminController.orderDetailView)
admin_route.post('/status/:orderId/',auth.isLogin,adminController.updateStatus)

admin_route.get('/addreferral_money',auth.isLogin,adminController.addrefferalmoneypag)
admin_route.post('/add_refferamout',auth.isLogin,adminController.addrefferalmoney)
admin_route.get("/product-edit",auth.isLogin,productController.getEditproductPage)
admin_route.post("/product-edit",uploadProduct.array("file"),productController.editUpdateProduct)

admin_route.post('/listCoupon', auth.isLogin,couponController.listCoupon);
admin_route.get('/unlistproduct', auth.isLogin,productController.unlistproduct);
admin_route.get('/listproduct', auth.isLogin,productController.listproduct);

admin_route.post('/deleteeditproduct', auth.isLogin,productController.deteEditeproduct)


admin_route.get("/salesreport", auth.isLogin,dashBoardReportController.salesReport)
admin_route.get('/reports/sales/download/:type',auth.isLogin, dashBoardReportController.adminDownloadReports);


module.exports = admin_route