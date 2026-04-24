// helpers/momoErrorHelper.js
function getMomoErrorMessage(code) {
  const errors = {
    "0": "Thanh toán thành công",
    "9000": "Giao dịch đã được xác nhận thành công",
    "8000": "Giao dịch đang được xử lý",
    "7000": "Giao dịch bị hủy bởi người dùng",
    "1001": "Thiếu tham số hoặc tham số không hợp lệ",
    "1002": "Chữ ký không hợp lệ",
    "1003": "Sai định dạng dữ liệu",
    "1004": "Giao dịch không tồn tại hoặc hết hạn",
    "1005": "Số tiền không hợp lệ",
    "1006": "Giao dịch bị từ chối bởi người dùng.",
    "1007": "Giao dịch bị từ chối",
    "1008": "Đơn hàng đã được thanh toán",
    "1009": "Lỗi hệ thống MoMo, vui lòng thử lại",
  };

  return errors[code] || "Thanh toán thất bại, vui lòng thử lại sau.";
}

module.exports = { getMomoErrorMessage };
