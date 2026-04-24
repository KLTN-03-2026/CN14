// const rateLimit = require("express-rate-limit");

// // Giới hạn 5 request / 1 phút cho login
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { code: 429, message: "Quá nhiều lần truy cập, vui lòng thử lại sau." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// module.exports = {
//   apiLimiter
// }

const rateLimit = require("express-rate-limit");

/**
 * Hàm tạo rate limiter động
 * @param {number} maxRequests - Số lượng request tối đa cho phép trong khoảng thời gian
 * @param {number} windowMinutes - Khoảng thời gian tính bằng phút
 */
const createRateLimiter = (maxRequests, windowMinutes) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000, // chuyển phút sang ms
    max: maxRequests,
    message: {
      code: 429,
      message: `Quá nhiều lần truy cập, vui lòng thử lại sau.{${windowMinutes}} phút.`,
    },
    standardHeaders: true,  // Gửi thông tin giới hạn trong header response
    legacyHeaders: false,   // Tắt header cũ
  });
};

module.exports = { createRateLimiter };
