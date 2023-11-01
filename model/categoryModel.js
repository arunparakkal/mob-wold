const mongoose = require("mongoose")
const CategorySchema = mongoose.Schema({
    categoryname:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    active:{
        type:Boolean,
        default:false
    },
    offer:{
        type:Number,
        require:true
    }
  
 
})

module.exports = mongoose.model("category",CategorySchema)