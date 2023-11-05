const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    Offeramout:{
        type:Number,
        required:true 
    },
   
})

module.exports = mongoose.model('Referraloffer',referralSchema)