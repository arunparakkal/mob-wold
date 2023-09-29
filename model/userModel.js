const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    image: {
        type:String
    },
    password:{
        type:String,
        require:true
    },
    is_admin:{
        type:Number,
        require:true
    },
    is_verified:{
        type:Number,
        default:0,
        require:true
    },
    is_block:{
        type:Boolean,
        default:false
    }
    
})
module.exports = mongoose.model("User",userSchema)