const mongoose = require("mongoose")
require("dotenv").config()


mongoose.connect(process.env.MONG_DB_URL).then(()=>{
    console.log("monngodb start");
}).catch((Error)=>{
    console.log(Error.message);
})


const express = require("express")
const app = express()

app.set("view engine","ejs")
app.set("views","./views/users")


app.use(express.static("public"));


const userRoute = require("./route/userRoute")
app.use("/",userRoute)

const adminRoute = require("./route/adminRoute")
app.use("/admin",adminRoute)
app.use((req,res,next)=>{
res.status(400).render("404")
})

app.listen(2000,()=>{console.log("start");})


