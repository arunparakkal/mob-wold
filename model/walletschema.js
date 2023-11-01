const mongoose = require("mongoose")
const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  transactions: [
    {
      Amount: {
        type:Number,
        default:0
      },
      transactionType:{
        type:String,
        enum:["debit","credit"],
        require:true
      },
       craetedAt :{
        type:Date,
        default:Date.now
       }

     
    }
  ]
});

module.exports =mongoose.model('Wallet', WalletSchema);
