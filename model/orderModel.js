const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalAmout: {
    type: Number,
    require: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      require: true
    },

    price: {
      type: Number,
      require: true
    }
  },
  ],
  orderStatus: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Shipped', 'Delivered', 'Returned'],
    default: 'Pending',
  },
  idPaid: {
    type: Boolean,
    default: false
  },
  address: {
    Name: {
      type: String,
      require: true
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


  },
  paymentmethod: {
    type: String,
    require: true
  },
  reasonResponse: {
    type: String,

  },
  totalprice: {
    type: Number,
    require: true
  },
  walletBalance: {
    type: Number,
    require: true
  }
})
module.exports = mongoose.model("Order", orderSchema)