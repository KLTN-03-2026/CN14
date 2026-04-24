const mongoose = require("mongoose");

const voucherGiftTemplateSchema = new mongoose.Schema({
  title: String, // Ví dụ: "Giảm 50.000đ cho đơn từ 300k"
  excerpt: String,
  discount: Number, // hoặc discountPercent
  minOrderValue: Number,
  maxOrderValue: Number,
  pointCost: Number, // Số điểm cần để đổi
  image: String, // hình hiển thị trong giao diện
  expiredAfterDays: Number, // vd: 7 ngày kể từ khi đổi
  status: {
    type: String,
    default: "active"
  },
  createBy: {
    user_Id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  deletedBy: {
    user_Id: String,
    deletedAt: Date,
  },
  updatedBy: [
    {
      user_Id: String,
      updatedAt: Date,
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
},
  {
    timestamps: true,
  });

const VoucherGiftTemplate = mongoose.model("VoucherGiftTemplate", voucherGiftTemplateSchema, "voucher-gift-templates");
module.exports = VoucherGiftTemplate;
