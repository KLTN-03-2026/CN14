const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      default: "pending"
      // "pending" Mới gửi, chưa được xem hoặc xử lý
      // "processing" Đã được nhân viên mở và đang xử lý
      // "resolved" Đã phản hồi và xử lý xong
      // "closed" Đã đóng yêu cầu, không xử lý thêm
      // "spam" Tin nhắn rác hoặc không hợp lệ
    },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Contact = mongoose.model("Contact", contactSchema, "contacts");

module.exports = Contact;
