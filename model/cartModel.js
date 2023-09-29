const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price:{
        type:Number,
        required:true
      },
      subTotal:{
        type:Number,
        required:true
      }
    }
  ],
    cartSubtotal: {
      type:Number,
      required: true,
    },
     cartTotal: {
      type:Number,
      required: true,
    },
  
},{timestamps:true});

 

module.exports = mongoose.model('Cart', cartSchema);
