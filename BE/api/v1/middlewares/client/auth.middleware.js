const jwt = require('jsonwebtoken');
const User = require('../../models/users.model');

module.exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      code: 400,
      message: "Chưa gửi token!",
    });
  }

  const token = authHeader && authHeader.split(' ')[1]; // tách "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // thông tin user được nhúng trong token

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Người dùng đã bị xóa!",
      });
    }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalid or expired' });
  }
}

module.exports.requireAuthOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // có user thì gán vào req.user
    } catch (err) {
      // token không hợp lệ => coi như guest
      req.user = null;
    }
  } else {
    req.user = null; // không có token => guest
  }
  next();
};