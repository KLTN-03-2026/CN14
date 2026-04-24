const User = require("../../models/users.model");
const Cart = require("../../models/carts.model");
const ForgotPassword = require("../../models/forgot-password.model");
const VoucherGiftTemplate = require("../../models/voucher-gift-template.model");
const VoucherGift = require("../../models/voucher-gift.model");
const productHelper = require("../../../../helpers/products");
const generateHelper = require("../../../../helpers/generateNumber");
const sendMailHelper = require("../../../../helpers/sendMail");
const md5 = require("md5");

const jwt = require("jsonwebtoken");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const VerifyEmail = require("../../models/verifyEmail.model");

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại trên hệ thống!",
    });
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  const newCart = new Cart({ user_id: user._id });
  await newCart.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    code: 200,
    message: "Tạo tài khoản thành công",
    tokenUser: token,
  });
};

module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
      res.json({
        code: 401,
        message: "Email không tồn tại!",
      });
      return;
    }

    if (user.isAuthAccount === false) {
      res.json({
        code: 401,
        message: "Tài khoản chưa được đặt mật khẩu!",
      });
      return;
    }

    if (md5(password) != user.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!",
      });
      return;
    }

    if (user.status != "active") {
      res.json({
        code: 400,
        message: "Tài khoản đã bị khóa!",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      tokenUser: token,
      fullName: user.fullName,
      avatar: user.avatar,
      userId: user._id,
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// [GET] /user/logout
module.exports.logoutPost = async (req, res) => {
  try {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });

    delete res.locals.tokenUser;

    res.json({
      code: 200,
      message: `Đăng xuất Email "${user.email}" thành công`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Chưa đăng nhập`,
    });
  }
};

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  }).select("email status");

  const existingEmail = await ForgotPassword.findOne({
    email: email,
  });

  if (existingEmail) {
    res.json({
      code: 400,
      message: `Email này đã được sử dụng để gửi mã OTP. 
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam). 
                  Hoặc bạn có thể sử dụng email khác để nhận mã OTP.`,
    });
    return;
  }

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }

  if (user.status === "inactive") {
    res.json({
      code: 400,
      message: "Tài khoản đã bị khóa!",
    });
    return;
  }

  const otp = generateHelper.generateNumber(6);
  const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000,
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // gửi otp qua email user
  const subject = "Mã OTP xác minh mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `;
  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: `Đã gửi mã otp qua Email: ${email}`,
    email: email,
  });
};

// [POST] user/password/optPassword
module.exports.optPasswordPost = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = req.body.otp;

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      res.json({
        code: 400,
        message: "Email không hợp lệ",
      });
      return;
    }

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!",
      });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      code: 200,
      message: "Xác thực thành công",
      tokenUser: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] user/password/reset-password
// đổi mật khẩu của phần quên mật khẩu
module.exports.resetPasswordPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const password = req.body.password;
    const comfirmPassword = req.body.comfirmPassword;

    if (password != comfirmPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu không khớp nhau",
      });
      return;
    }

    const user = await User.findOne({
      _id: userId,
    }); // check xem có user có token không

    if (md5(password) === user.password) {
      // check mật khẩu cũ
      res.json({
        code: 400,
        message: "Mật khẩu mới trùng với mật khẩu cũ",
      });
      return;
    }

    await User.updateOne(
      {
        _id: userId,
      },
      {
        password: md5(password),
      }
    );

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId }).select("-password").lean();
    const ordersOfUser = await Order.find({
      user_id: userId,
      status: "completed" // chỉ tính đơn đã hoàn tất
    });

    // Tổng chi tiêu = tổng (totalOrder - discountAmount + shippingFee)
    const totalExpend = ordersOfUser.reduce((sum, i) => {
      return sum + Number(i.totalOrder - i.discountAmount + i.shippingFee);
    }, 0);

    user.totalExpend = totalExpend;
    res.json({
      code: 200,
      message: "Thông tin cá nhân",
      data: user,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /user/info/edit
module.exports.editInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const existEmail = req.body.email;

    const existUser = await User.findOne({
      email: existEmail,
      _id: { $ne: userId },
    });

    if (existUser) {
      res.json({
        code: 400,
        message: "Email đã tồn tại trên hệ thống!",
      });
      return;
    }

    await User.updateOne(
      {
        _id: userId,
      },
      req.body
    );
    res.json({
      code: 200,
      message: "Cập nhật thông tin thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /info/reset-password
module.exports.resetPasswordPatch = async (req, res) => {
  try {
    const userId = req.user.id;

    const passwordOld = req.body.passwordOld;
    const passwordNew = req.body.passwordNew;
    const passwordNewComfirm = req.body.passwordNewComfirm;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.json({
        code: 400,
        message: "Không tìm thấy user!",
      });
      return;
    }

    if (md5(passwordOld) !== user.password) {
      res.json({
        code: 400,
        message: "Mật khẩu không đúng",
      });
      return;
    }

    if (passwordNew !== passwordNewComfirm) {
      res.json({
        code: 400,
        message: "Mật khẩu không khớp nhau",
      });
      return;
    }

    await User.updateOne(
      {
        _id: userId,
      },
      {
        password: md5(passwordNew),
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [GET] /user/voucher-gifts/templates
module.exports.voucherGiftsTempGet = async (req, res) => {
  try {
    const records = await VoucherGiftTemplate.find({
      deleted: false,
      status: "active"
    }).sort({ pointCost: "asc" })
      .select("-createdAt -updatedAt -deleted -deletedAt -createBt -updatedBy")
      .lean();

    res.json({
      code: 200,
      message: "Thông tin đổi quà",
      data: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};

// [GET] /user/voucher-gifts/my-voucher-gifts
module.exports.myVoucherGifts = async (req, res) => {
  try {

    const userId = req.user.id;

    const records = await VoucherGift.find({
      owner: userId
    }).sort({ createdAt: -1 })
      .lean();

    res.json({
      code: 200,
      message: "Phiếu giảm giá của bạn",
      data: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};

function generateVoucherCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// [PATCH] /user/voucher-gifts/exchange-voucher-gift
module.exports.exchangeVoucherGift = async (req, res) => {
  try {
    const userId = req.user.id;
    const voucherTempId = req.body.id
    const user = await User.findOne({ _id: userId }).select("points")
    const voucherTemp = await VoucherGiftTemplate.findOne({ _id: voucherTempId });

    if (!user) {
      res.json({
        code: 204,
        message: "Không tìm thấy người dùng",
      });
      return;
    }

    if (!voucherTemp) {
      res.json({
        code: 204,
        message: "Không tìm thấy voucher muốn đổi!",
      });
      return;
    }

    if (user.points < voucherTemp.pointCost) {
      res.json({
        code: 400,
        message: "Bạn không đủ điểm để đổi voucher này!"
      });
      return;
    }

    const newVoucher = await VoucherGift.create({
      code: generateVoucherCode(8),
      discount: voucherTemp.discount,
      minOrderValue: voucherTemp.minOrderValue,
      maxOrderValue: voucherTemp.maxOrderValue,
      owner: user._id,
      expiredAt: new Date(Date.now() + voucherTemp.expiredAfterDays * 24 * 60 * 60 * 1000),
      template: voucherTempId
    })

    user.points = user.points - voucherTemp.pointCost;
    await user.save();

    res.json({
      code: 200,
      message: "Đổi phiếu quà tặng thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};

//[GET] /history-order
module.exports.ordersHistoryByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await Order.find({ user_id: userId }).sort({ createdAt: -1 }).lean();

    for (const item of records) {
      if (item.products.length > 0) {
        let totalQuantity = 0;

        for (const product of item.products) {
          const priceNew = productHelper.priceNew(product);
          totalQuantity += product.quantity;

          const infoProduct = await Product.findOne({
            _id: product.product_id
          }).select("title");
          if (!infoProduct) {
            product.title = "Đã xóa";
          } else {
            product.title = infoProduct.title;
          }

          product.totalPrice = priceNew * product.quantity;
        }

        item.totalQuantity = totalQuantity;
      }
    }

    res.json({
      code: 200,
      message: "Lịch sử đơn hàng",
      records: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi" + error.message,
    });
  }
};

//[POST] /user/send-otp
module.exports.sendEmailOtpRegister = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({
      email: email,
    });

    if (user) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!",
      });
      return;
    }

    const existingEmail = await VerifyEmail.findOne({
      email: email,
      role: "register",
    });

    if (existingEmail) {
      res.json({
        code: 400,
        message: `Email này đã được sử dụng để gửi mã OTP. 
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam). 
                  Hoặc bạn có thể sử dụng email khác để nhận mã OTP.`,
      });
      return;
    }

    const otp = generateHelper.generateNumber(6);
    const timeExpire = 5;

    const objectVerifyEmail = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
      role: "register",
    };

    const verifyEmail = new VerifyEmail(objectVerifyEmail);
    await verifyEmail.save();

    // gửi opt qua email user
    const subject = "Mã OTP xác minh Email của bạn";
    const html = `
    Mã OTP để đăng ký tài khoản là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `;
    sendMailHelper.sendMail(email, subject, html);

    res.json({
      code: 200,
      message: `Đã gửi mã OTP qua Email: ${email}`,
      email: email,
    });
  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`,
    });
  }
};

//[POST] /verify-otp
module.exports.verifyEmailOtpRegister = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await VerifyEmail.findOne({
      email: email,
      otp: otp,
      role: "register",
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!",
      });
      return;
    }

    result.expireAt = Date.now(); // xóa bản ghi
    await result.save();

    res.json({
      code: 200,
      message: "Xác thực thành công",
    });
  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`,
    });
  }
};

//[POST] /user/send-otp
module.exports.sendEmailOtpAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.body.email;

    const userAuth = await User.findOne({ _id: userId });

    if (userAuth.email !== email) {
      const userExsist = await User.findOne({
        email: email,
        _id: { $ne: userId }
      });

      if (userExsist) {
        res.json({
          code: 400,
          message: "Email đã tồn tại trên hệ thống!",
        });
        return;
      }
    }

    const existingEmail = await VerifyEmail.findOne({
      email: email,
      role: "account",
    });

    if (existingEmail) {
      res.json({
        code: 400,
        message: `Email này đã được sử dụng để gửi mã OTP. 
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam). 
                  Hoặc bạn có thể sử dụng email khác để nhận mã OTP.`,
      });
      return;
    }

    const otp = generateHelper.generateNumber(6);
    const timeExpire = 5;

    const objectVerifyEmail = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
      role: "account",
    };

    const verifyEmail = new VerifyEmail(objectVerifyEmail);
    await verifyEmail.save();

    // gửi opt qua email user
    const subject = "Mã OTP xác minh Email của bạn";
    const html = `
    Mã OTP để đăng ký tài khoản là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `;
    sendMailHelper.sendMail(email, subject, html);

    res.json({
      code: 200,
      message: `Đã gửi mã OTP qua Email: ${email}`,
      email: email,
    });
  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`,
    });
  }
};

//[POST] /verify-otp
module.exports.verifyEmailOtpAccount = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await VerifyEmail.findOne({
      email: email,
      otp: otp,
      role: "account",
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!",
      });
      return;
    }

    result.expireAt = Date.now();
    await result.save();

    res.json({
      code: 200,
      message: "Xác thực thành công",
    });
  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`,
    });
  }
};
