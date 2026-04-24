const Transactions = require("../../models/transactions.model.js");
const Order = require("../../models/order.model.js");
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
const sendMailHelper = require("../../../../helpers/sendMail");
const Product = require("../../models/product.model.js");
const productHelper = require("../../../../helpers/products");
const {
  renderProductsTable,
} = require("../../../../helpers/renderProductsTable");
const Voucher = require("../../models/voucher.model.js");
const VoucherGift = require("../../models/voucher-gift.model.js");
const { getVNPayErrorMessage } = require("../../../../helpers/vnpayErrorCode.js");


// [POST] /vn-pay/create-qr
module.exports.createQr = async (req, res) => {
  try {
    const { code, Amount, orderInfo } = req.body;
    console.log(Math.round(Number(Amount)));
    
    // Lấy thông tin đơn hàng
    const order = await Order.findOne({ code })
      .select("code voucher_code user_id");

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng!"
      });
    }

    // Nếu có voucher
    if (order.voucher_code) {
      // Kiểm tra voucher hệ thống
      const voucher = await Voucher.findOne({
        voucher_code: order.voucher_code,
        status: "active",
        deleted: false
      });

      // Kiểm tra voucher quà tặng
      const voucherGift = await VoucherGift.findOne({
        code: order.voucher_code,
        owner: order.user_id,
        used: false
      });

      // Nếu không tồn tại voucher nào
      if (!voucher && !voucherGift) {
        await Promise.all([
          Order.updateOne(
            { code },
            { $unset: { voucher_code: "" }, $set: { discountAmount: 0 } }
          ),
          Transactions.deleteMany({ code_TxnRef: code, status: "pending" }) // ✅ Xóa transaction cũ
        ]);

        return res.json({
          code: 202,
          message: "Không tìm thấy voucher!"
        });
      }

      const now = Date.now();

      // Kiểm tra hạn sử dụng
      if (
        (voucher && now > new Date(voucher.end_date).getTime()) ||
        (voucherGift && now > new Date(voucherGift.expiredAt).getTime())
      ) {
        await Promise.all([
          Order.updateOne(
            { code },
            { $unset: { voucher_code: "" }, $set: { discountAmount: 0 } }
          ),
          Transactions.deleteMany({ code_TxnRef: code, status: "pending" }) // ✅ Xóa transaction cũ
        ]);

        return res.json({
          code: 202,
          message: "Voucher đã hết hạn!"
        });
      }

      // Kiểm tra số lượng
      if (voucher && voucher.quantity <= voucher.used_count) {
        await Promise.all([
          Order.updateOne(
            { code },
            { $unset: { voucher_code: "" }, $set: { discountAmount: 0 } }
          ),
          Transactions.deleteMany({ code_TxnRef: code, status: "pending" }) // ✅ Xóa transaction cũ
        ]);

        return res.json({
          code: 202,
          message: "Số lượng voucher đã hết!"
        });
      }
    }

    // Kiểm tra đơn hàng đã thanh toán hoặc giao dịch đang chờ
    const existPaid = await Transactions.findOne({
      status: "paid",
      code_TxnRef: code
    });

    if (existPaid) {
      return res.json({
        code: 204,
        message: "Đơn hàng đã được thanh toán, vui lòng tải lại trang!"
      });
    }

    const existTxn = await Transactions.findOne({
      code_TxnRef: code,
      provider: "vnpay",
      status: { $in: ["pending", "expired", "failed"] }
    });

    const realAmount = order.totalOrder - order.discountAmount + order.shippingFee;

    // Nếu có transaction đang chờ hoặc đã hết hạn nhưng số tiền không khớp → xóa để tạo lại
    if (existTxn && existTxn.amount !== realAmount) {
      await Transactions.deleteMany({
        code_TxnRef: code,
        provider: "vnpay",
        status: { $in: ["pending", "expired", "failed"] } // ✅ xóa cả failed để làm sạch
      });
    }
    // Nếu có transaction hợp lệ (số tiền đúng) và vẫn đang chờ hoặc hết hạn nhẹ thì trả về link cũ
    else if (existTxn) {
      return res.json({
        code: 200,
        payUrl: existTxn.paymentUrl
      });
    }

    // Cấu hình VNPay
    const vnpay = new VNPay({
      tmnCode: process.env.TMNCODE,
      secureSecret: process.env.SECURESECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: Number(Amount),
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_TxnRef: `${code}-${Date.now()}`,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${process.env.BACKEND_URL}/api/v1/vn-pay/check-payment-vnpay`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    const latestTxn = await Transactions.findOne({ code_TxnRef: code }).sort({ createdAt: -1 });
    const retryCount = latestTxn ? latestTxn.retryCount + 1 : 0;

    await Transactions.create({
      code_TxnRef: code,
      amount: Number(Amount),
      orderInfo,
      paymentUrl: vnpayResponse,
      provider: "vnpay",
      status: "pending",
      retryCount,
    });

    return res.json({
      code: 201,
      payUrl: vnpayResponse
    });

  } catch (error) {
    console.error("VNPay Error:", error);
    return res.json({
      code: 400,
      message: "Lỗi: " + error.message
    });
  }
};

// [GET] /vn-pay/check-payment-vnpay
module.exports.checkPayment = async (req, res) => {
  const code = req.query.vnp_TxnRef.split("-")[0];
  const isSuccess = req.query.vnp_ResponseCode === "00";

  if (isSuccess) {
    await Transactions.updateOne(
      { code_TxnRef: code, provider: "vnpay" },
      { status: "paid" }
    );

    const order = await Order.findOne({ code: code }).lean();

    await Order.updateOne(
      { code: code },
      { status: "received", paymentMethod: "bank-vnpay" }
    );

    // gửi opt qua email user
    const subject = "Khách hàng đã xác nhận thanh toán đơn hàng";
    const html = `
          <p>Mã đơn hàng <b>${code}</b></p>
          <p>Tên khách hàng <b>${order.userInfo.fullName}</b></p>
          <p>Phương thức thanh toán <b>Bank</b></p>
        `;
    sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

    // gửi thông tin đơn hàng
    const products = [];
    let totalQuantity = 0;

    if (order.products.length > 0) {
      // tổng số lượng sản phẩm của đơn hàng
      for (const product of order.products) {
        const priceNew = productHelper.priceNew(product);

        totalQuantity += product.quantity;

        const infoProduct = await Product.findOne({
          _id: product.product_id,
          deleted: false,
          status: "active",
        }).select("title discountPercentage");

        const objProducts = {
          priceNew: priceNew,
          quantity: product.quantity,
          discountPercentage: infoProduct.discountPercentage,
          size: product.size,
          title: infoProduct.title,
        };
        products.push(objProducts);
      }
    }

    // gửi opt qua email user
    const subject2 =
      "Đơn hàng của bạn đã được thanh toán thành công, chúng tôi sẽ giao đến bạn sớm nhất";
    const productsTableHTML = renderProductsTable(products); // `products` là mảng bạn đã có

    const html2 = `
          <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi!</p>
          <p><b>Mã đơn hàng:</b> ${order.code}</p>
          <p><b>Tên khách hàng:</b> ${order.userInfo.fullName}</p>
          <p><b>Phương thức thanh toán:</b> ${order.paymentMethod}</p>
          <br/>
          <p><b>Chi tiết đơn hàng:</b></p>
          ${productsTableHTML}
          <br/>
          <p><b>Tổng số lượng sản phẩm</b> ${totalQuantity}</p>
          <p><b>Tổng tiền đơn hàng</b> ${order.totalOrder.toLocaleString()} + ${order.shippingFee.toLocaleString()} đ</p>
          <a href="${process.env.FRONTEND_URL
      }/order/checkout/pay/success/${code}" style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">Xem chi tiết đơn hàng</a>
          <p>Trân trọng,<br/>Cửa hàng XYZ</p>
          `;
    sendMailHelper.sendMail(order.userInfo.email, subject2, html2);

    // Redirect về trang frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}/order/checkout/pay/success/${code}`
    );
  } else {
    await Transactions.updateOne(
      { code_TxnRef: code, provider: "vnpay" },
      {
        status: "failed",
        responseCode: req.query.vnp_ResponseCode,
        transactionNo: req.query.vnp_TransactionNo,
        bankCode: req.query.vnp_BankCode,
        errorMessage: getVNPayErrorMessage(req.query.vnp_ResponseCode),
        rawResponse: req.query,
      }
    );
    return res.redirect(
      `${process.env.FRONTEND_URL}/order/checkout/pay/fail/${code}`
    );
  }

  //   {
  //   vnp_Amount: '10000000',
  //   vnp_BankCode: 'NCB',
  //   vnp_BankTranNo: 'VNP15085784',
  //   vnp_OrderInfo: 'order_id1',
  //   vnp_PayDate: '20250720000048',
  //   vnp_ResponseCode: '00',
  //   vnp_TmnCode: 'NQES4APX',
  //   vnp_TransactionNo: '15085784',
  //   vnp_TransactionStatus: '00',
  //   vnp_TxnRef: 'ordercode3',
  //   vnp_SecureHash: '5399289604b942b8263ddc37da1c18c81ae4f6090817a3d7bda6a70a3d7fc3752eb87a10c7fbba402fb5120f6c7896c7326d3fda229a60a27877c432e773ec2a'
  //   }
};
