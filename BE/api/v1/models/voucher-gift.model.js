const mongoose = require("mongoose");

const voucherGiftSchema = new mongoose.Schema({
  code: String,
  discount: Number,
  minOrderValue: Number,
  maxOrderValue: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  used: { type: Boolean, default: false },
  expiredAt: Date,
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'VoucherGiftTemplate' }
},
  {
    timestamps: true,
  });


const VoucherGift = mongoose.model('VoucherGift', voucherGiftSchema, "voucher-gifts");

module.exports = VoucherGift; 
