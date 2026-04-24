const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["momo", "vnpay"],
      required: true,
    },

    // Mã tham chiếu (bạn sinh ra, ví dụ: order_code)
    code_TxnRef: { type: String, required: true },

    // Tổng số tiền giao dịch
    amount: { type: Number, required: true },

    // Nội dung đơn hàng
    orderInfo: String,

    // URL thanh toán (do MoMo / VNPay trả về)
    paymentUrl: String,

    // Trạng thái giao dịch
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired", "cancelled"],
      default: "pending",
    },

    // --- Chi tiết phản hồi (mỗi provider có khác nhau) ---
    responseCode: String, // vnp_ResponseCode | resultCode
    transactionNo: String, // vnp_TransactionNo | transId
    bankCode: String, // vnp_BankCode
    payType: String, // momo: payType (QR, App, ...)

    // --- Log / lỗi ---
    errorMessage: String, // mô tả lỗi người đọc được
    rawResponse: Object, // lưu nguyên body phản hồi từ cổng thanh toán (dễ debug)
    retryCount: { type: Number, default: 0 }, // dùng cho cron retry sau này

    // --- Liên kết đến Order ---
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  {
    timestamps: true,
  }
);

const Transactions = mongoose.model(
  "Transactions",
  transactionsSchema,
  "transactions"
);

module.exports = Transactions;
