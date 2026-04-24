const errorMessages = {
  "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ gian lận.",
  "09": "Thẻ/Tài khoản chưa đăng ký InternetBanking.",
  "10": "Xác thực OTP sai quá số lần cho phép.",
  "11": "Đã hết hạn đăng nhập.",
  "12": "Thẻ/Tài khoản bị khóa.",
  "24": "Khách hàng hủy giao dịch.",
  "51": "Không đủ số dư.",
  "65": "Vượt quá hạn mức giao dịch.",
  "75": "Ngân hàng đang bảo trì.",
  "79": "Không nhận được phản hồi từ ngân hàng.",
  "99": "Lỗi hệ thống VNPay.",
};
module.exports.getVNPayErrorMessage = (code) =>
  errorMessages[code] || "Thanh toán thất bại. Vui lòng thử lại.";
