const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // User ID associated with this address (if needed)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // You may have a 'User' schema for user information
    required: true,
  },
  addresses:[
    {
      Name: {
        type: String,
        required: true,
      },
     Number: {
        type: Number,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
     isDefault:{
      type:Boolean,
      default:false
     }
    }
  ]
  
});



module.exports = mongoose.model('Address', addressSchema);
