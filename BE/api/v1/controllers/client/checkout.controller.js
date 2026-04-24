const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const ShippingSetting = require("../../models/shippingSetting.model");
const sendMailHelper = require("../../../../helpers/sendMail");
const Voucher = require("../../models/voucher.model");
const { calculateTotalPrice } = require("../../../../helpers/calculateTotal");
const VerifyEmail = require("../../models/verifyEmail.model");
const generateHelper = require("../../../../helpers/generateNumber");
const Transactions = require("../../models/transactions.model");
const VoucherGift = require("../../models/voucher-gift.model");

// [GET] /order/detail/:orderId
module.exports.detailOrder = async (req, res) => {
  try {
    const code = req.params.code;

    const order = await Order.findOne({ code: code }).lean();

    if (order.products.length > 0) {
      for (const item of order.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" })
          .select("title thumbnail price slug discountPercentage");

        const priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
        item.totalPrice = priceNew * item.quantity;
        item.priceNew = priceNew
        item.productInfo = productInfo;
      }
    }

    const transaction = await Transactions.findOne({ code_TxnRef: code }).lean();

    res.json({
      code: 200,
      message: `Giỏ hàng`,
      data: { order, transaction }
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi`
    });
  }
}

// [POST] /checkout/order-user
module.exports.orderPostGuest = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // có thể null
    const userInfo = req.body.userInfo;
    const productItems = req.body.productItems;

    let products = [];
    let invalidProducts = []; // lưu các sp không hợp lệ

    if (!productItems || productItems.length === 0) {
      return res.json({
        code: 400,
        message: "Không có sản phẩm nào trong đơn hàng!"
      });
    }

    for (const product of productItems) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
        status: "active"
      }).select("price discountPercentage deleted");

      if (!productInfo) {
        invalidProducts.push(product.product_id);
        continue;
      }

      if (productInfo.deleted === true) {
        invalidProducts.push(product.product_id);
        continue;
      }

      products.push({
        product_id: product.product_id,
        price: productInfo.price,
        quantity: product.quantity,
        discountPercentage: productInfo.discountPercentage,
        size: product.size
      });
    }

    // Nếu có sản phẩm không hợp lệ => báo lỗi cho khách hàng biết
    if (invalidProducts.length > 0) {
      return res.json({
        code: 400,
        message: "Một số sản phẩm trong đơn hàng đã bị xóa hoặc không tồn tại"
      });
    }

    if (userId) {
      // === Khách hàng đã đăng nhập ===
      // Nếu tất cả hợp lệ thì clear giỏ hàng
      await Cart.updateOne({ user_id: userId }, { products: [] });
    }

    // Tính phí ship
    const shipping = await ShippingSetting.findOne();
    const totalOrder = calculateTotalPrice(products);
    const fee = shipping.freeThreshold < totalOrder ? 0 : shipping.defaultFee;

    // Tạo đơn hàng
    const orderObj = {
      userInfo: userInfo,
      products: products,
      user_id: userId || null,
      totalOrder,
      shippingFee: fee,
      status: "initialize"
    };

    const order = new Order(orderObj);
    await order.save();

    // Gửi email cho admin/shop
    const subject = "Có đơn hàng mới vừa được khởi tạo";
    const html = `
      Mã đơn hàng <b>${order.code}</b><br/>
      Tên khách hàng <b>${order.userInfo.fullName}</b><br/>
      Email khách hàng <b>${order.userInfo.email}</b><br/>
      Số điện thoại khách hàng <b>${order.userInfo.phone}</b>
    `;
    sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

    return res.json({
      code: 200,
      message: "Đơn hàng đã được tạo, xin vui lòng tiến hành thanh toán",
      codeOrder: order.code
    });

  } catch (error) {
    return res.json({
      code: 400,
      message: "Lỗi: " + error.message
    });
  }
};

module.exports.checkVoucher = async (req, res) => {
  try {
    const order_code = req.body.order_code;
    const voucher_code = req.body.voucher_code;

    const order = await Order.findOne({ code: order_code });

    if (!order) {
      res.json({
        code: 204,
        message: "Không tìm thấy đơn hàng này!"
      });
      return;
    }

    const voucher = await Voucher.findOne({ voucher_code: voucher_code, status: "active", deleted: false });

    if (!voucher) {
      res.json({
        code: 204,
        message: "Mã voucher không đúng!"
      });
      return;
    }

    if (voucher.voucher_code === order.voucher_code) {
      res.json({
        code: 204,
        message: "Voucher này đã được áp dụng cho đơn hàng của bạn!"
      });
      return;
    }

    const dayNow = Date.now();
    if (dayNow > new Date(voucher.end_date).getTime()) {
      res.json({
        code: 204,
        message: "Voucher đã hết hạn!"
      });
      return;
    }
    if (dayNow < new Date(voucher.start_date).getTime()) {
      res.json({
        code: 204,
        message: "Voucher chưa được kích hoạt!"
      });
      return;
    }

    if (voucher.quantity === voucher.used_count) {
      res.json({
        code: 204,
        message: "Số lượng voucher đã hết!"
      });
      return;
    }

    if (order.totalOrder < voucher.min_order_value) {
      res.json({
        code: 204,
        message: "Đơn hàng không đủ điều kiện để nhận voucher!"
      });
      return;
    }

    let newTotalOrder;
    if (voucher.discount_value < 100) {
      newTotalOrder = order.totalOrder - ((order.totalOrder * voucher.discount_value) / 100);
    } else {
      newTotalOrder = order.totalOrder - voucher.discount_value;
    }

    let discountAmount = order.totalOrder - newTotalOrder;
    if (discountAmount > voucher.max_order_value) {
      discountAmount = voucher.max_order_value;
    }

    // await Voucher.updateOne({ voucher_code: voucher_code }, { used_count: voucher.used_count + 1 });
    await Order.updateOne({ code: order_code },
      {
        voucher_code: voucher_code,
        discountAmount: discountAmount
      });

    res.json({
      code: 200,
      message: "Voucher đã được áp dụng thành công!"
    });

    // res.redirect(`/checkout/success/${order._id}`);
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 400,
      message: "Lỗi, vui lòng thử lại"
    });
  }
}

module.exports.checkVoucherGift = async (req, res) => {
  try {
    const order_code = req.body.order_code;
    const voucher_code = req.body.voucher_code;
    const user_id = req.user.id;

    const order = await Order.findOne({ code: order_code });
    if (!order) {
      res.json({
        code: 204,
        message: "Không tìm thấy đơn hàng này!"
      });
      return;
    }

    const voucher = await VoucherGift.findOne({
      code: voucher_code,
      owner: user_id,
      used: false
    });

    if (!voucher) {
      res.json({
        code: 204,
        message: "Mã voucher không đúng!"
      });
      return;
    }

    if (voucher.used === true) {
      res.json({
        code: 204,
        message: "Voucher đã được sử dụng!"
      });
      return;
    }
    if (voucher.code === order.voucher_code) {
      res.json({
        code: 204,
        message: "Voucher này đã được áp dụng cho đơn hàng của bạn!"
      });
      return;
    }
    const dayNow = Date.now();
    if (dayNow > new Date(voucher.expiredAt).getTime()) {
      res.json({
        code: 204,
        message: "Voucher đã hết hạn!"
      });
      return;
    }

    if (order.totalOrder < voucher.minOrderValue) {
      res.json({
        code: 204,
        message: "Đơn hàng không đủ điều kiện để nhận voucher!"
      });
      return;
    }

    let newTotalOrder;
    if (voucher.discount < 100) {
      newTotalOrder = order.totalOrder - ((order.totalOrder * voucher.discount) / 100);
    } else {
      newTotalOrder = order.totalOrder - voucher.discount;
    }

    let discountAmount = order.totalOrder - newTotalOrder;
    if (discountAmount > voucher.maxOrderValue) {
      discountAmount = voucher.maxOrderValue;
    }

    await Order.updateOne({ code: order_code },
      {
        voucher_code: voucher_code,
        discountAmount: discountAmount
      });

    res.json({
      code: 200,
      message: "Voucher đã được áp dụng thành công!"
    });
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 400,
      message: "Lỗi, vui lòng thử lại"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    // chỉ dành cho thanh toán bằng cod
    const orderId = req.params.orderId;
    const paymentMethod = req.body.paymentMethod;

    const recordOrder = await Order.findOne({ _id: orderId }).lean();
    const order_code = recordOrder.code;

    // kiểm tra thanh toán chưa
    const existPaid = await Transactions.findOne({
      status: "paid",
      code_TxnRef: recordOrder.code,
    });
    if (existPaid) {
      res.json({
        code: 204,
        message: "Bạn đã thanh toán đơn hàng này, load lại trang để xem chi tiết!"
      });
      return;
    }

    // kiểm tra mã voucher
    const voucher_code = recordOrder.voucher_code;

    if (voucher_code) {
      const voucher = await Voucher.findOne({
        voucher_code: voucher_code,
        status: "active",
        deleted: false
      });
      if (!voucher) {
        res.json({
          code: 204,
          message: "Không tìm thấy voucher!"
        });
        await Order.updateOne(
          { code: order_code },
          {
            $unset: { voucher_code: "" },
            discountAmount: 0
          });
        return;
      }

      const dayNow = Date.now();
      if (dayNow > new Date(voucher.end_date).getTime()) {
        res.json({
          code: 204,
          message: "Voucher đã hết hạn!"
        });
        await Order.updateOne(
          { code: order_code },
          {
            $unset: { voucher_code: "" },
            discountAmount: 0
          });
        return;
      }

      if (voucher.quantity === voucher.used_count) {
        res.json({
          code: 204,
          message: "Số lượng voucher đã hết!"
        });
        await Order.updateOne(
          { code: order_code },
          {
            $unset: { voucher_code: "" },
            discountAmount: 0
          });
        return;
      }
    }

    if (recordOrder) {
      await Order.updateOne({ _id: orderId }, {
        paymentMethod: paymentMethod
      });

      // gửi opt qua email user
      const subject = "Khách hàng đã xác nhận đặt hàng";
      const html = `
          <p>Mã đơn hàng <b>${recordOrder.code}</b></p>
          <p>Tên khách hàng <b>${recordOrder.userInfo.fullName}</b></p>
          <p>Phương thức thanh toán <b>${paymentMethod}</b></p>
        `
      sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

      res.json({
        code: 200,
        message: "Đặt đơn thành công, chúng tôi sẽ liên hệ lại với bạn để xác nhận",
      });

    } else {
      res.json({
        code: 404,
        message: "Đơn hàng không tồn tại"
      });
    }
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 400,
      message: "Lỗi, " + error.message
    });
  }
}

//[POST] /user/send-otp
module.exports.sendEmailOtpOrder = async (req, res) => {
  try {
    const email = req.body.email;

    const existingEmail = await VerifyEmail.findOne({
      email: email,
      role: "order"
    });

    if (existingEmail) {
      res.json({
        code: 400,
        message: `Email này đã được sử dụng để gửi mã OTP. 
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam). 
                  Hoặc bạn có thể sử dụng email khác để nhận mã OTP.`
      });
      return;
    }

    const otp = generateHelper.generateNumber(6);
    const timeExpire = 5;

    const objectVerifyEmail = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
      role: "order"
    }

    const verifyEmail = new VerifyEmail(objectVerifyEmail);
    await verifyEmail.save();

    // gửi opt qua email user
    const subject = "Mã OTP xác minh Email của bạn";
    const html = `
    Mã OTP để đăng ký tài khoản là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `
    sendMailHelper.sendMail(email, subject, html);

    res.json({
      code: 200,
      message: `Đã gửi mã OTP qua Email: ${email}`,
      email: email
    });
  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`
    });
  }
}

//[POST] /verify-otp
module.exports.verifyEmailOtpOrder = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await VerifyEmail.findOne({
      email: email,
      otp: otp,
      role: "order"
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!"
      });
      return;
    }

    result.expireAt = Date.now(); // xóa bản ghi
    await result.save();

    res.json({
      code: 200,
      message: "Xác thực thành công"
    });

  } catch (err) {
    res.json({
      code: 400,
      message: `Lỗi !: ${err.message}`
    });
  }
}