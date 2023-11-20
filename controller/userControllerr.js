
const userHelper = require("../helper/userHelper")
const User = require("../model/userModel");
const Wallet = require("../model/walletschema")
const product = require("../model/product");
const bcrypt = require("bcrypt")
const Address = require("../model/addressModel")
const Cart = require('../model/cartModel')
const Category = require('../model/categoryModel')
const randomString = require("randomstring")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const express = require("express")
const session = require("express-session");
const { products } = require("./productControllerr");
const Order = require("../model/orderModel")
const Coupon = require('../model/couponModel')




const Razorpay = require("razorpay");
const { fail } = require("assert");
const { Script } = require("vm");
const instance = new Razorpay({ key_id: "rzp_test_YlNy1JDmG6jBsS", key_secret: "UYShvJyM5iv74aB3yUZ5lNvq" })


const objj = {}
//load home
const passwordHash = async (password) => {
    try {
        hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword

    }
    catch (Error) {
        console.log(Error.message);
        res.render('404', { user: req.session.user_id })
    }
}
const sendVerifyMail = async (name, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "arunaru0034@gmail.com",
                pass: "mlfxkmzrmyauvbml"
            }
        })
        const mailOption = {
            from: "arunaru0034@gmail.com",
            to: email,
            subject: "For verification mail",
            html: '<p>Hyy ' + name + " " + "this is your verify opt " + "  " + otp + ' "</p>'

        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {

            } else {
                console.log("Email has been send :-", info.response);
            }
        })

    }
    catch (error) {
        console.log(error.message);
    }
}
const LoadHome = async (req, res) => {
    try {
        const products = await product.find({isListed: true})
   
        res.render("users/home", { products });

    }
    catch (Error) {
        console.log(Error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const Logout = async (req, res) => {
    try {
        delete req.session.user_id
        res.redirect("/")

    }
    catch (Error) {
        console.log(Error.message);
    }
}
const LoadHomee = async (req, res) => {
    try {

        const products = await product.find({isListed: true})
        const Id = req.session.user_id

        const userData = await User.findOne({ _id: Id });
        return res.render("users/home", { products, user: req.session.user_id });

    }
    catch (Error) {
        console.log(Error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

// signup page
const loadsignUp = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.render("users/siginup")
    }
    catch (error) {
        console.log(error.message)
        res.render('users/404', { user: req.session.user_id })
    }
}

//user insert
const inserUser = async (req, res) => {
    try {
        const Spassword = await passwordHash(req.body.password)
        const existEmail = await User.findOne({ email: req.body.email });
        // if (existEmail) {
        // //   return res.render("users/siginup",{ message: "Email already exists." });
        // }

        const CSpassword = await passwordHash(req.body.Cpassword)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: Spassword,
            is_admin: 0

        })

        const userData = await user.save()
        const CpasswordMatch = await bcrypt.compare(req.body.Cpassword, Spassword)
        if (CpasswordMatch) {

            if (userData) {
                const otp = randomString.generate({ length: 4, charset: "numeric" })
                objj.OTP = otp
                console.log(objj.OTP)
                await sendVerifyMail(req.body.name, req.body.email, otp)
                res.redirect(`/otp?id=${userData._id} `);
            }
            else {
                res.render("siginup", { message: "your registerarion Failed" })
            }
        } else {

            res.render("users/siginup", { message: "password is not matched" })
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const recentOpt = async (req, res) => {
    try {
        const userId = req.query.userId.trim();
        console.log(userId, req.query.userId);
        const otp = randomString.generate({ length: 4, charset: "numeric" })
        objj.OTP = otp
        console.log("recent", objj.OTP);
        await sendVerifyMail(req.body.name, req.body.email, otp)
        const userData = await User.findOne({ _id: userId });
        res.redirect(`otp?id=${userData._id}`);
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

//otp page loader
const otppage = async (req, res) => {
    try {

        res.render("users/otp", { userId: req.query.id })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

//otp verification
const VerifyOtp = async (req, res) => {
    try {
        const formdata = req.body.otp1
        console.log("Received form data:", formdata);
        const otp1 = req.body.otp1;
        const otp2 = req.body.otp2;
        const otp3 = req.body.otp3;
        const otp4 = req.body.otp4;
        const Newopt = otp1 + otp2 + otp3 + otp4
        console.log("newOtp :-", Newopt);


        if (objj.OTP === Newopt) {
            delete objj.OTP
            console.log("new", Newopt);
            console.log("obj", objj.OTP);
            const id = req.body.userId.trim()

            const udpateinfo = await User.updateOne({ _id: id }, { $set: { is_verified: 1 } })
            console.log("kdjkdjd");
            res.redirect("/")
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

//user verification

const loadLogin = async (req, res) => {
    try {
        res.render("users/login")
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404')
    }
}


const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({ email: email })

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_verified == 0) {
                    res.render("users/login", { message: "user not verified please verify" })
                } else {

                    req.session.user_id = userData._id

                    req.session.isLoggedIn = true;

                    res.redirect("/home")
                }
            } else {
                res.render("users/login", { message: "password is incorrect" })
            }
        } else {
            res.render("users/login", { message: "your Email is incorrect" })
        }
    }
    catch (error) {
        console.log(error.message)
        res.render('users/404')
    }

}
const loadShop = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 3;
        let totalProductsCount;
        let products;
        let totalPages;

        const selectedCategory = req.query.categoryname || 'all';
        console.log("selected category 2.0",selectedCategory);

        const categories = await Category.aggregate([
            {
                $match: { active: true },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'categoryname',
                    foreignField: 'categoryname',
                    as: 'products',
                },
            },
            {
                $addFields: {
                    hasListedProducts: {
                        $gt: [{ $size: '$products' }, 0],
                    },
                },
            },
            {
                $match: { hasListedProducts: true },
            },
        ]);
       
        if (selectedCategory !== 'all') {
            const category = await Category.findOne({ categoryname: selectedCategory });

            if (category) {
                totalProductsCount = await product.countDocuments({
                    categoryname: category.categoryname,
                    isListed: true, // Filter for listed products
                });

                products = await product.find({
                    categoryname: category.categoryname,
                    isListed: true, // Filter for listed products
                })
                    .sort({ date: -1 })
                    .skip((page - 1) * itemsPerPage)
                    .limit(itemsPerPage)
                    .lean();
            } else {
                totalProductsCount = 0;
                products = [];
            }
        } else {
            totalProductsCount = await product.countDocuments({ isListed: true }); // Filter for listed products
            products = await product.find({ isListed: true }) // Filter for listed products
                .sort({ date: -1 })
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .lean();
        }

        totalPages = Math.ceil(totalProductsCount / itemsPerPage);

        res.render('users/shop', {
            products,
            categories,
            currentPage: page,
            totalPages,
            user: req.session.user_id,
            selectedCategory, // Pass the selected category to the view for highlighting in the UI
        });
    } catch (error) {
        console.error('Error in loadShop:', error);
        res.render('users/404', { user: req.session.user_id });
    }
};





// const loadShop = async (req, res) => {
//     try {

//         let products;
//         const selectedCategory = req.query.categoryname || 'all';

//         const categories = await Category.find();
//         if (selectedCategory !== 'all') {
//             const category = await Category.findOne({ categoryname: selectedCategory });


//             if (category) {
//                 products = await product.find({ categoryname: category.categoryname });


//             } else {
//                 products = await product.find();
//                 console.log('shop', products.categoryname);
//             }

//         } else {
//             products = await product.find();

//         }

//         res.render("users/shop", { products, categories, user: req.session.user_id });
//     }
//     catch (error) {
//         console.log(error.message);
//         res.render('users/404',{user:req.session.user_id})
//     }
// };

const loadprofile = async (req, res) => {
    try {


        let walletData = await Wallet.findOne({ user: req.session.user_id })
        if (!walletData) {
            walletData = await Wallet.create({ user: req.session.user_id, balance: 0 })
        }


        const userData = await User.findOne({ _id: req.session.user_id })

        res.render("users/profile", { user: userData, walletData })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const editProfile = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.query.user })
        res.render("users/editprofile", { userData })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const updateUser = async (req, res) => {
    try {

        const { name, email, mobile } = req.body

        if (req.file) {
            const image = req.file.filename
            const updateUser = await User.findOneAndUpdate({ _id: req.body.userId }, { $set: { name: name, email: email, mobile: mobile, image: image } })

        } else {
            const updateUser = await User.findOneAndUpdate({ _id: req.body.userId }, { $set: { name: name, email: email, mobile: mobile } })

        }
        res.redirect("/profile")
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const LoadAddress = async (req, res) => {
    try {
        res.render("users/address", { user: req.session.userId })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const insertData = async (req, res) => {
    try {

        const { name, mobile, address1, address2, state, postalCode, country } = req.body
        const userAddress = await Address.findOne({ userId: req.session.user_id })
        const address = {

            Name: name,
            Number: mobile,
            addressLine1: address1,
            addressLine2: address2,
            state: state,
            postalCode: postalCode,
            country: country

        }

        if (!userAddress || (userAddress && userAddress.addresses.length < 1)) {
            const newAddress = new Address({
                userId: req.session.user_id,
                addresses: address


            })
            const addresData = await newAddress.save()

        } else {
            userAddress.addresses.push(address)
            userAddress.save()
        }
        console.log("ooiuimport",req.body.add);
        if (req.body.add == "scre") {
 
            res.redirect("/checkout")
        } else {
            res.redirect("/addresses")
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404')
    }
}

const LoadAllAddress = async (req, res) => {
    try {

        const addresData = await Address.findOne({ userId: req.session.user_id })
        res.render('users/addresses', { addresData, user: req.session.user_id })


    } catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const LoadCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({ userId: req.session.user_id }).populate('products.productId')
        res.render("users/cartPage", { cart, user: req.session.user_id })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const AddtoCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        const productData = await product.findOne({ _id: req.body.productId })

        if (productData.quantity < 1) {

            return res.json({ noStock: true })
        }

        let cart = await Cart.findOne({ userId: req.session.user_id })
        if (!cart) {
            cart = new Cart({ userId: req.session.user_id })
        }

        const productIndex = cart.products.findIndex((product) => {

            return product.productId.toString() === productId

        })


        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity
            cart.products[productIndex].subTotal =
                cart.products[productIndex].price * cart.products[productIndex].quantity


        } else {

            cart.products.push({
                productId,
                quantity,
                price: productData.salesprice,
                subTotal: productData.salesprice
            })
        }
        productData.quantity -= 1
        cart.cartSubtotal = cart.products.reduce((total, product) => {
            return total + product.quantity * product.price
        }, 0)
        cart.cartTotal = cart.products.reduce((total, product) => {
            return total + product.quantity * product.price
        }, 0)

        const newCart = await Promise.all([cart.save(), productData.save()])

        return res.json(newCart)



    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

const Checkoutaddress = async (req, res) => {
    try {
        const sec = "scre"

        res.render("users/addressplace", { sec, user: req.session.user_id })

    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const Checkout = async (req, res) => {
    try {

        const couponCode = req.query.couponCode;
        const cart = await Cart.findOne({ userId: req.session.user_id }).populate('products.productId');

        if (cart) {
            const products = cart.products;
            let calculateTotalPrice = cart.cartTotal;

            let discountAmount = 0;
            let coupon = null;

            if (couponCode) {
                const selectedCoupon = await Coupon.findOne({ couponCode: couponCode });
                if (selectedCoupon) {
                    discountAmount = (calculateTotalPrice * selectedCoupon.discount) / 100;


                    if (discountAmount > selectedCoupon.maxDiscount) {
                        discountAmount = selectedCoupon.maxDiscount;

                    }

                    coupon = selectedCoupon;
                } else {
                    console.log('Selected coupon not found');
                }
            }

            calculateTotalPrice -= discountAmount;
            req.session.calculateTotalPrice = calculateTotalPrice; // Store in session

            const AddresData = await Address?.find({ userId: req.session.user_id });
            const UserAddress = AddresData[0]?.addresses;
           
           
    //         if(UserAddress.length == 1){
    //             const addId = UserAddress[0]._id
             
    //     const user = await Address.findOne({ userId: req.session.user_id })
    //     console.log("user",user);
        
       
      
        
    //  console.log("jj",user.addresses.isDefault);
    //     user.addresses.isDefault = true
    //     await user.save()
    //     console.log("jj",user.addresses.isDefault);
    //     const f = await Address.find()
            
    //     }
            const defaultAddress = UserAddress?.find(address => address.isDefault == true);
                   
            const discount = discountAmount;
            const coupons = await Coupon.find();
            const walletData = await Wallet.findOne({ user: req.session.user_id })

            res.render("users/checkout", { cart: cart, defaultAddress, user: req.session.user_id, coupon, calculateTotalPrice, discount, walletData });
        } else {
            res.render("users/checkout", { user: req.session.user_id });
        }
    } catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
        // Handle the error, e.g., show an error message to the user
    }
}


const Default = async (req, res) => {
    try {
        const addId = req.query.addressId
        const user = await Address.findOne({ userId: req.session.user_id })
        if (!user) {

            res.render('users/login')
        }
        user.addresses = user.addresses.map((val) => {
            val.isDefault = false
            return val
        })
        const updateData = user.addresses.find((add) => {

            return add._id.toString() === addId
        })

        updateData.isDefault = true
        await user.save()
        res.redirect('/addresses')
    }
    catch (error) {
        console.log(error.message)
        res.render('users/404', { user: req.session.user_id })
    }
}
const Changepassword = async (req, res) => {
    try {

        let message;

        if (req?.query?.message) {
            message = req?.query?.message
        }

        res.render("users/pwdupdate", { message })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const addPassword = async (req, res) => {
    try {
        const { password, npassword, rpasword } = req.body
        const userData = await User.findOne({ _id: req.session.user_id })
        const checkpassword = await bcrypt.compare(password, userData.password)

        if (checkpassword) {
            const Spassword = await passwordHash(npassword)
            console.log("secure", Spassword)
            const updatePassword = await User.updateOne({ _id: req.session.user_id }, { $set: { password: Spassword } })
            console.log("updated", updatePassword);
            res.redirect("/changepassword")
        } else {
            // res.render("users/pwdupdate", { message: "Incorrect password" })
            res.redirect("/changepassword?message=Incorrect password")
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

const placeOrder = async (req, res) => {
    try {
        const address = req.body.address;
        const cart = await Cart.findOne({ userId: req.session.user_id });
        const paymentMethod = req.body.paymentmethod;

        let calculateTotalPrice = 0;
        if (!cart || cart.products.length === 0) {
            return res.json({ success: false, message: "Cart is empty. Cannot place an order." });
        }
        if (req.session.calculateTotalPrice) {
            calculateTotalPrice = req.session.calculateTotalPrice;
        } else {

            calculateTotalPrice = cart.cartTotal;
        }

        // Update the cart's total amount
        cart.cartTotal = calculateTotalPrice;


        const walletData = await Wallet.findOne({ user: req.session.user_id })


        if (paymentMethod === 'cod') {
            const newOrder = new Order({
                userId: req.session.user_id,
                totalAmount: cart.cartTotal, // Corrected property name
                products: cart.products,
                orderStatus: "Pending", // Corrected property name
                isPaid: false,
                address: {
                    Name: address.name,
                    Number: address.mobile,
                    addressLine1: address.address1,
                    addressLine2: address.address2,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                },
                totalprice: calculateTotalPrice,
                paymentmethod: paymentMethod,
            });
            await newOrder.save();
            res.json({ method: 'cod' });
            cart.products = [];
            await cart.save();

        } else if (paymentMethod === "online") {
            const newOrder = new Order({
                userId: req.session.user_id,
                totalAmount: cart.cartTotal,
                products: cart.products,
                orderStatus: "Pending",
                isPaid: false,
                address: {
                    Name: address.name,
                    Number: address.mobile,
                    addressLine1: address.address1,
                    addressLine2: address.address2,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                },
                totalprice: calculateTotalPrice,
                paymentmethod: paymentMethod,
            });
            req.session.newOrder = newOrder;
            const savedOrder = req.session.newOrder      
          
            const generateOrder = await generateOrderRazorpay(
                savedOrder._id,
                cart.cartTotal,
                
            );
            cart.products = []
            await cart.save()
            res.json({ generateOrder, method: 'online' });
        } else if (paymentMethod === 'wallet') {
            if (walletData.balance < cart.cartTotal) {

                return res.json({ method:"wallet", nowallet: false, error: "Wallet have no enough balance" })
            } else {

                // const walletData = await Wallet.findOne({ user: req.session.user_id })
                // const balanceamt = walletData.balance - calculateTotalPrice
                // const walletupdate = await Wallet.updateOne({ user: req.session.user_id }, { $set: { balance: balanceamt } })

                const wallet = await Wallet.findOne({ user: req.session.user_id });

                if (wallet) {
                    const debitTransaction = {
                        Amount: calculateTotalPrice,
                        transactionType: 'debit',
                    };


                    wallet.transactions.push(debitTransaction);
                    wallet.balance -= debitTransaction.Amount; // Update the balance accordingly


                }

                const newOrder = new Order({
                    userId: req.session.user_id,
                    totalAmount: cart.cartTotal, // Corrected property name
                    products: cart.products,
                    isPaid: false,
                    address: {
                        Name: address.name,
                        Number: address.mobile,
                        addressLine1: address.address1,
                        addressLine2: address.address2,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country,
                    },

                    totalprice: calculateTotalPrice,
                    paymentmethod: paymentMethod,
                    walletBalance: wallet.balance
                });
                await wallet.save();
                await newOrder.save();


                cart.products = [];
                await cart.save();
                
                res.status(200).json({newOrder,method:"wallet"});

            }

        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });

    }
};


const generateOrderRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: total * 100,
            currency: "INR",
            receipt: String(orderId)
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log("failed");
                console.log(err);
                reject(err);
            } else {
                console.log("Order Generated RazorPAY: " + JSON.stringify(order));
                resolve(order);
            }
        });
    })

}
const verifyOrderPayment = (details) => {
    console.log("DETAILS : " + JSON.stringify(details));
    return new Promise((resolve, reject) => {
        const crypto = require('crypto');

        let hmac = crypto.createHmac('sha256', 'UYShvJyM5iv74aB3yUZ5lNvq');
        hmac.update(
            String(details['order']['generateOrder']['id']) + '|' +// Access order_id directly
            String(details['payment']['razorpay_payment_id'])
        );
        hmac = hmac.digest('hex');

        console.log('orderid', details['order']['generateOrder']['id']); // Corrected access to order_id
        console.log('paymentid', details['payment']['razorpay_payment_id']);
        console.log('signature', details['payment']['razorpay_signature']);

        if (hmac === details['payment']['razorpay_signature']) {
            console.log("Verify SUCCESS");
            resolve();
        } else {
            console.log("Verify FAILED");
            reject();
        }
    });
};


const verifyRazorpayPayment = async (req, res) => {

    const userId = req.session.user_id;
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    try {
        const { razorpayOrderId, razorpayPaymentId, secret } = req.body;
        verifyOrderPayment(req.body)
            .then(async () => {
                const orders = req.session.newOrder
                const saveOrder = new Order(orders)

                await saveOrder.save()
                
                const cart = req.body.cart
              
                res.json({ status: true });

            }).catch((err) => {
                console.log(err);
                res.json({ status: false, errMsg: 'Payment failed!' });
            });
    } catch (err) {
        console.log(err);
        res.json({ status: false, errMsg: 'Payment failed!' });
    }
}



const cartQuantity = async (req, res) => {
    try {

        const { productId, quantity } = req.body
        const userId = req.session.user_id
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.json({ message: 'cart not found' })
        }      
        const cartProduct = cart.products.find((product) => {
            return product.productId._id.toString() === productId
        })
        const products = await product.findById({ _id: productId })
        console.log(products.quantity);
        const stockAnalize = cartProduct.quantity - quantity

        if (stockAnalize < 0) {           
            products.quantity -= 1
        } else if (stockAnalize > 0) {
        
            products.quantity += 1
        }
        await products.save()
     
        if (!cartProduct) {
            return res.json({ message: 'product not found' })
        }

        cartProduct.quantity = quantity;
        let total = 0;

        for (const product of cart.products) {
            let productPrice = product.price;
            let productSubtotal = productPrice * product.quantity

            product.subTotal = productSubtotal
            total += productSubtotal

        }
        products.quantity -= 1
        cart.cartSubtotal = total;
        cart.cartTotal = total
        const updatedCart = await cart.save()
        res.json(updatedCart)

    } catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }

}
const RemoveCart = async (req, res) => {
    try {


        const itemId = req.params.itemId
        const carId = req.session.user_id
        const cartData = await Cart.find({ userId: carId });
        const productData = cartData[0].products
        const removeProudctId = productData._id

        const existingProduct = productData.find((product) => {

            return product._id.toString() === itemId

        });
        const minusAmout = existingProduct.price;

        const Discount = cartData[0].cartTotal - minusAmout


        const updatetottal = await Cart.updateOne({ userId: carId }, { $set: { cartTotal: Discount, cartSubtotal: Discount } })
        const PPdata = await Cart.findOne({ userId: carId })
        const PData = PPdata.cartTotal

        const result = await Cart.findOneAndUpdate(
            { 'products._id': itemId }, // Find the cart that contains the product with the specified '_id'
            { $pull: { products: { _id: itemId } } }, // Remove the product from the 'products' array
            { new: true } // Return the updated cart after the removal
        );

        if (result) {
            const success = true;
            res.json({ PData, success, result });
        } else {
            console.log('Cart item not found or product not removed.');
        }


    }
    catch (error) {
        console.error("Error", error);
        res.render('users/404', { user: req.session.user_id })
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const placedOrder = async (req, res) => {
    try {
        const data = req.body



    } catch (error) {
        console.log(error.message)
        res.status(404).json({ error: "payment failed" })
    }
}

const listOrder = async (req, res) => {
    try {
        const products = await product.find();
        const userId = req.session.user_id;
        const user = await User.findById(userId);

        const perPage = 10; // Number of orders per page
        const page = parseInt(req.query.page) || 1;

        const totalOrders = await Order.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalOrders / perPage);

        const order = await Order.find({ userId: userId })
            .populate('products.productId')
            .sort({ orderDate: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.render('users/orderlist', {
            order,
            user,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const orderdetail = async (req, res) => {
    try {

        const orderId = req.params.orderId;

        const userId = req.session.user_id;
        const products = await product.find()
        const user = await User.findById(userId)
        const order = await Order.findById(orderId).populate('products.productId userId');
        console.log('orders', order)
        res.render('users/orderdetail', { order, user, products })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const orderData = await Order.findById({ _id: orderId });

        const wallet = await Wallet.findOne({ user: req.session.user_id });

        if (wallet) {
            const debitTransaction = {
                Amount: orderData.totalprice,
                transactionType: 'credit',
            };


            wallet.transactions.push(debitTransaction);
            wallet.balance += debitTransaction.Amount; // Update the balance accordingly


        }
        await wallet.save()

        // const WalletUpdate = await Wallet.updateOne({ user: req.session.user_id }, { $set: { balance:totalBalance } })
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.orderStatus === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }
        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel a delivered order' });
        }
        const currentDate = new Date();
        const orderDate = order.orderDate;
        const daysDifference = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

        if (daysDifference > 10) {
            return res.status(400).json({ message: 'Cannot cancel an order placed for more than 10 days' });
        }



        order.orderStatus = 'Cancelled';
        await order.save();

        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const returnOrder = async (req, res) => {
    try {

        const { orderId, selectedReason } = req.body;
        const orderData = await Order.findById({ _id: orderId });

        const wallet = await Wallet.findOne({ user: req.session.user_id });

        if (wallet) {
            const debitTransaction = {
                Amount: orderData.totalprice,
                transactionType: 'credit',
            };


            wallet.transactions.push(debitTransaction);
            wallet.balance += debitTransaction.Amount; // Update the balance accordingly

            await wallet.save()
        }


        // const WalletUpdate = await Wallet.updateOne({ user: req.session.user_id }, { $set: { balance:totalBalance } })
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.orderStatus !== 'Delivered') {
            return res.status(400).json({ error: 'NotDelivered' });
        }

        const currentDate = new Date();
        const orderDate = order.orderDate;
        const daysDifference = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

        if (daysDifference > 10) {
            return res.json({ error: 'Over10Days' });
        }

        order.orderStatus = 'Returned';
        order.reasonResponse = selectedReason;
        await order.save();

        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const Foregetpassword = async (req, res) => {
    try {

        res.render("users/forgotpassword")

    } catch (error) {

        console.log(error.message);
    }
}

//resetpassword 

const sendresetpasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "arunaru0034@gmail.com",
                pass: "mlfxkmzrmyauvbml"
            }
        })
        const mailOption = {
            from: "arunaru0034@gmail.com",
            to: email,
            subject: "For Reset password",
            html: '<p>Hyy ' + name + ', please click here to <a href="http://127.0.0.1:2000/forgot-password?token=' + token + ' "> Reset </a> your password</p>'

        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {

            } else {
                console.log("Email has been send :-", info.response);
            }
        })

    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

const Foregotverify = async (req, res) => {
    try {
        const email = req.body.email
        const userData = await User.findOne({ email: email })
        if (userData) {

            if (userData.is_verified === 0) {
                res.render("users/forgotpassword", { message: "please verify Your mail" })
            } else {
                const randomstring = randomString.generate()
                const updateUser = await User.updateOne({ email: email }, { $set: { token: randomstring } })
                sendresetpasswordMail(userData.name, userData.email, randomstring)
                res.render("users/forgotpassword", { message: "plesase check your mail to reset a password" })
            }
        } else {
            res.render("users/forgotpassword", { message: "Email is incorrect" })
        }


    } catch (error) {

        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

const ForegotpasswordLoad = async (req, res) => {
    try {

        const token = req.query.token

        const tokenData = await User.findOne({ token: token })
        if (tokenData) {

            res.render("users/forget-password", { user_id: tokenData._id })
        } else {
            res.render("users/404", { message: "token is invalid" })
        }

    } catch (error) {

        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const resetpassword = async (req, res) => {
    try {
        const password = req.body.password

        const secure_password = await passwordHash(password)
        console.log(secure_password);

        const updateData = await User.findOneAndUpdate({ _id: req.body.user_id }, { $set: { password: secure_password, token: '' } })

        res.redirect("/")

    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const Walletrecharge = async (req, res) => {
    try {
        const amount = parseInt(req.body.amount, 10);
        let walletData;

        const transaction = {
            Amount: amount,
            transactionType: 'credit',
            craetedAt: new Date()
        }
        const userWallet = await Wallet.findOne({ user: req.session.user_id })

        if (!userWallet) {
            const wallet = new Wallet({
                user: req.session.user_id,
                balance: amount,
                transactions: [transaction]
            })

            walletData = await wallet.save();
        } else {
            userWallet.balance += amount
            userWallet.transactions.push(transaction)
            userWallet.save()
        }

        res.json({ success: true })

    } catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
};
const walletHistory = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const itemsPerPage = 8;
        const wallet = await Wallet.findOne({ user: req.session.user_id })

        const totalTransactions = wallet ? wallet.transactions.length : 0;
        const totalPages = Math.ceil(totalTransactions / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const sortedTransactions = wallet ? wallet.transactions.sort((a, b) => b.craetedAt - a.craetedAt) : [];
        const transactions = wallet ? wallet.transactions.slice(startIndex, endIndex)
            : [];

        res.render("users/wallethistory", {
            wallet, transactions, currentPage: page,
            totalPages,
        })
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}

const errorpage = async (req, res) => {
    try {
        res.render("users/404")
    }
    catch (error) {
        console.log(error.message);
        res.render('users/404', { user: req.session.user_id })
    }
}
const search = async(req,res)=>{
    try{
      const serachQuery = req.body.search
      const queryCondition = {
        categoryname:{$regex:new RegExp(serachQuery,"i")}
      }
      console.log("queryCondition",queryCondition);
      await renderProductsPage(req, res, queryCondition);

     
    }
    catch(error){
        console.log(error.message);
    }
}
const renderProductsPage = async (req, res, queryConditions) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 4;

        const categories = await Category.aggregate([
            {
                $match: { active: true },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'categoryname',
                    foreignField: 'categoryname',
                    as: 'products',
                },
            },
            {
                $addFields: {
                    hasListedProducts: {
                        $gt: [{ $size: '$products' }, 0],
                    },
                },
            },
            {
                $match: { hasListedProducts: true },
            },
        ]);

        const categoryname = req.query.categoryname || 'all';

        let totalProductsCount;
        let products;

        if (categoryname !== 'all') {
            const selectedCategory = categories.find((cat) => cat.categoryname === categoryname);
            console.log("kdkdjd");
            if (!selectedCategory) {
            
                return res.render('users/products', { categories, products: [], categoryname });
            }

            queryConditions.categoryname = selectedCategory.categoryname;
        }
        totalProductsCount = await product.countDocuments(queryConditions);
  
        products = await product.find(queryConditions)
            .sort({ date: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .lean();

        const totalPages = Math.ceil(totalProductsCount / itemsPerPage);

        return res.render('users/shop', {
            categories,
            products,
            categoryname,
            currentPage: page,
            totalPages: totalPages,
            user:req.session.user_id
        });
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = {
    LoadHome, loadsignUp, inserUser, otppage, VerifyOtp, loadLogin, verifyLogin, LoadHomee, loadShop, Logout, loadprofile, editProfile, updateUser, LoadAddress, insertData, LoadAllAddress, LoadCart, AddtoCart, recentOpt, Checkout, Default, Changepassword, addPassword, Checkoutaddress, placeOrder, cartQuantity, RemoveCart, placedOrder, listOrder, verifyRazorpayPayment, generateOrderRazorpay, orderdetail, cancelOrder, Foregetpassword, Foregotverify, ForegotpasswordLoad, resetpassword, Walletrecharge, walletHistory, returnOrder, errorpage,search,
}