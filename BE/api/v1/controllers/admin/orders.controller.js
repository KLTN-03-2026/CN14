// file này dùng để tạo hàm render ra giao diện 
const Order = require("../../models/order.model");
const Voucher = require("../../models/voucher.model");
const Product = require("../../models/product.model");
const ShippingSetting = require("../../models/shippingSetting.model");
const sendMailHelper = require("../../../../helpers/sendMail");
const productHelper = require("../../../../helpers/products");
const { updateSizeStock } = require("../../../../helpers/updateSizeStock");
const { getQuantityBySize } = require("../../../../helpers/getQuantityBySize");
const { renderProductsTable } = require("../../../../helpers/renderProductsTable");
const VoucherGift = require("../../models/voucher-gift.model");
const User = require("../../models/users.model");
const searchHelper = require("../../../../helpers/search");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  try {
    const { day, month, keyword, limit, page } = req.query;

    let find = {
    };

    // Phân trang
    const limitItems = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    const countRecord = await Order.countDocuments(find);
    const totalPage = Math.ceil(countRecord / limitItems);
    const skip = (currentPage - 1) * limitItems;

    if (day && day !== "") {
      find.createdAt = {
        $gte: new Date(`${day}T00:00:00.000Z`),
        $lte: new Date(`${day}T23:59:59.999Z`)
      };
    }

    if (month && month !== "") {
      const [year, mon] = month.split("-");
      const start = new Date(Number(year), Number(mon) - 1, 1, 0, 0, 0); // ngày đầu tháng
      const end = new Date(Number(year), Number(mon), 0, 23, 59, 59, 999); // ngày cuối tháng

      find.createdAt = {
        $gte: start,
        $lte: end
      };
    }
    // Tìm kiếm
    if (keyword && keyword !== "") {
      const searchData = searchHelper(req.query);
      if (searchData.keyword) {
        find = { ...find, ...searchData.condition };
      }
    }

    const orders = await Order.find(find)
      .limit(limitItems)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    for (const item of orders) {
      if (item.products.length > 0) {
        let totalPrice = 0;
        let totalQuantity = 0;
        for (const product of item.products) {
          const productInfo = await Product.findOne({ _id: product.product_id, deleted: false })
            .select("title");
          if (productInfo) {
            product.title = productInfo.title;
          } else {
            product.title = "Sản phẩm đã bị xóa"
          }

          const priceNew = productHelper.priceNew(product);
          totalPrice += priceNew * product.quantity;
          totalQuantity += product.quantity;
        }

        item.totalOrder = totalPrice;
        item.totalQuantity = totalQuantity;
      }
    }

    res.json({
      code: 200,
      message: "Quản lý đơn hàng",
      data: {
        orders,
        totalPage,
        currentPage,
      },
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi hệ thống: ${error.message}`
    });
  }
}

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Order.findOne({ _id: id }).lean();
    if (record.products.length > 0) {
      for (const item of record.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({
          _id: productId,
          deleted: false,
          status: "active"
        }).select("title");

        item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
        item.totalPrice = item.newPrice * item.quantity;

        item.title = productInfo ? productInfo.title : "[Sản phẩm đã bị xóa]";
      }
    }
    record.totalPriceProducts = record.products.reduce((sum, item) => item.totalPrice + sum, 0);

    const shippingSetting = await ShippingSetting.findOne().lean();
    let shippingFee = 0;
    if (recordsOrder.totalOrder < shippingSetting.freeThreshold) {
      shippingFee = shippingSetting.defaultFee;
    }

    res.json({
      code: 200,
      message: "Chi tiết đơn hàng",
      data: data,
      shippingFee: shippingFee
    });
  } catch (error) {
    console.log(error);

    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [GET] /admin/orders/shipping-settings
module.exports.changeStatus = async (req, res) => {
  try {
    const { code, status } = req.params;
    const order = await Order.findOne({ code });

    if (!order) return res.json({ code: 400, message: "Đơn hàng không tồn tại!" });

    // trạng thái hợp lệ
    const allowedTransitions = {
      initialize: ["confirmed", "cancelled"],
      received: ["confirmed", "cancelled", "returned"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipping", "cancelled"],
      shipping: ["completed", "cancelled"],
      completed: ["returned"],
      cancelled: [],
      returned: []
    };

    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.json({
        code: 400,
        message: `Không thể chuyển từ '${order.status}' sang '${status}'`
      });
    }

    // render email
    const products = [];
    let totalQuantity = 0;

    for (const p of order.products) {
      totalQuantity += p.quantity;
      const infoProduct = await Product.findOne({ _id: p.product_id, deleted: false }).select("title");
      const title = infoProduct ? infoProduct.title : "Sản phẩm đã bị xóa";
      products.push({
        title,
        size: p.size,
        quantity: p.quantity,
        discountPercentage: p.discountPercentage,
        priceNew: productHelper.priceNew(p)
      });
    }

    // chung
    const sendMailToUser = (subject, html) =>
      sendMailHelper.sendMail(order.userInfo.email, subject, html);

    const baseEmailInfo = `
      <p><b>Mã đơn hàng:</b> ${order.code}</p>
      <p><b>Tên khách hàng:</b> ${order.userInfo.fullName}</p>
      <p><b>Phương thức thanh toán:</b> ${order.paymentMethod || "COD"}</p>
      <a href="${process.env.FRONTEND_URL}/order/checkout/pay/success/${code}" target="_blank" rel="noopener noreferrer">
        Xem chi tiết đơn hàng
      </a>
    `;

    const productsHTML = renderProductsTable(products);
    const totalHTML = `
      <p><b>Tổng số lượng:</b> ${totalQuantity}</p>
      <p><b>Tổng tiền:</b> ${(order.totalOrder - order.discountAmount + order.shippingFee).toLocaleString()} đ</p>
    `;

    // Xử lý 
    switch (status) {
      case "confirmed": {
        if (order.voucher_code) {
          await Promise.all([
            Voucher.updateOne({ voucher_code: order.voucher_code }, { $inc: { used_count: 1 } }),
            VoucherGift.updateOne({ code: order.voucher_code }, { used: true })
          ]);
        }

        await Order.updateOne({ code }, { status, paymentMethod: order.paymentMethod || "cod" });

        const html = `
          <p>Cảm ơn bạn đã đặt hàng!</p>
          <p>Chúng tôi sẽ giao hàng đến bạn sớm nhất.</p>
          ${baseEmailInfo}
          ${productsHTML}
          ${totalHTML}
        `;
        sendMailToUser(`Xác nhận đơn hàng #${order.code}`, html);
        return res.json({ code: 200, message: "Đơn hàng đã được xác nhận" });
      }

      case "received": {
        await Order.updateOne({ code }, { status });
        const html = `
          <p>Thanh toán đơn hàng của bạn đã thành công.</p>
          ${baseEmailInfo}
          ${productsHTML}
          ${totalHTML}
        `;
        sendMailToUser(`Thanh toán đơn hàng #${order.code} thành công`, html);
        return res.json({ code: 200, message: "Đã nhận thanh toán" });
      }

      case "processing":
        await Order.updateOne({ code }, { status });
        return res.json({ code: 200, message: "Đơn hàng đang xử lý" });

      case "shipping": {
        await Order.updateOne({ code }, { status });
        const html = `
          <p>Đơn hàng ${order.code} đã được bàn giao cho đơn vị vận chuyển.</p>
          ${baseEmailInfo}
        `;
        sendMailToUser(`Đơn hàng #${order.code} đang giao`, html);
        return res.json({ code: 200, message: "Đơn hàng đã bàn giao cho đơn vị vận chuyển" });
      }

      case "completed": {
        // Cập nhật kho & sản phẩm
        for (const p of order.products) {
          const productOld = await Product.findById(p.product_id);
          if (!productOld) continue;

          const quantityStock = getQuantityBySize(productOld.sizeStock, p.size);
          const updatedSizeStock = updateSizeStock(productOld.sizeStock, p.size, quantityStock - p.quantity);

          await Product.updateOne(
            { _id: p.product_id },
            {
              sizeStock: updatedSizeStock,
              stock: productOld.stock - p.quantity,
              sold: productOld.sold + p.quantity
            }
          );
        }

        await Order.updateOne({ code }, { status });

        // Cập nhật rank & điểm user
        if (order.user_id) {
          const ordersOfUser = await Order.find({ user_id: order.user_id, status: "completed" });
          const totalExpend = ordersOfUser.reduce(
            (sum, o) => sum + Number(o.totalOrder - o.discountAmount + o.shippingFee),
            0
          );

          let rank = "Member";
          if (totalExpend >= 200_000_000) rank = "Diamond";
          else if (totalExpend >= 10_000_000) rank = "Platinum";
          else if (totalExpend >= 5_000_000) rank = "Gold";
          else if (totalExpend >= 1_000_000) rank = "Silver";

          const user = await User.findOne({ _id: order.user_id, deleted: false }).select("points").lean();
          const newPoints = user.points + (order.totalOrder - order.discountAmount + order.shippingFee) / 10000;

          await User.updateOne({ _id: order.user_id }, { rank, points: newPoints });
        }

        const html = `
          <p>Đơn hàng #${order.code} đã được giao thành công!</p>
          ${productsHTML}
          <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời tại cửa hàng của chúng tôi.</p>
          ${baseEmailInfo}
        `;
        sendMailToUser(`Đơn hàng #${order.code} đã hoàn tất`, html);
        return res.json({ code: 200, message: "Đơn hàng đã hoàn thành" });
      }

      case "cancelled": {
        await Order.updateOne({ code }, { status });
        const html = `
          <p>Xin chào <b>${order.userInfo.fullName}</b>,</p>
          <p>Rất tiếc đơn hàng của bạn đã bị hủy.</p>
          ${baseEmailInfo}
          <p>Chúng tôi hy vọng sẽ phục vụ bạn trong những lần mua sắm tiếp theo!</p>
        `;
        sendMailToUser(`Thông báo hủy đơn hàng #${order.code}`, html);
        return res.json({ code: 200, message: "Đơn hàng đã hủy" });
      }

      case "returned":
        await Order.updateOne({ code }, { status });
        return res.json({ code: 200, message: "Đơn hàng đã được hoàn trả" });

      default:
        return res.json({ code: 400, message: "Trạng thái không hợp lệ" });
    }
  } catch (error) {
    console.error("Lỗi changeStatus:", error);
    res.json({ code: 400, message: "Lỗi xử lý trạng thái đơn hàng" });
  }
};

module.exports.getShippingSettings = async (req, res) => {
  try {
    const shipping = await ShippingSetting.find({}).lean();
    res.json({
      code: 200,
      message: "Cài đặt vận chuyển",
      data: shipping
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: `Lỗi hệ thống: ${error.message}`
    });
  }
}

// [PATCH] /admin/orders/shipping-settings
module.exports.updateShippingSettings = async (req, res) => {
  try {
    const shipping = await ShippingSetting.findOne({});

    if (shipping) {
      await ShippingSetting.updateOne({
        _id: shipping._id
      }, req.body);
    } else {
      const setting = new ShippingSetting(req.body);
      await setting.save();
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: `Lỗi hệ thống: ${error.message}`
    });
  }
}

module.exports.products = async (req, res) => {
  try {
    const products = await Product.find({
      deleted: false,
      status: "active"
    }).select("_id title sizeStock price discountPercentage").lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        products
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
}

module.exports.updateProductToOrder = async (req, res) => {
  try {
    const { order_id, product_id, size, quantity, price, discountPercentage } = req.body;

    if (!order_id || !product_id || !size || !quantity || !price || !discountPercentage) {
      return res.json({
        code: 400,
        message: "Thiếu dữ liệu bắt buộc"
      });
    }

    const order = await Order.findById(order_id);

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng"
      });
    }

    if (order.status !== "initialize") {
      return res.json({
        code: 400,
        message: "Đơn hàng không ở trạng thái khởi tạo, không thể thay đổi!"
      });
    }

    const existedProduct = order.products.find(
      item => item.product_id === product_id && item.size === size
    );

    if (existedProduct) {
      // Đã tồn tại → cộng số lượng
      existedProduct.quantity += quantity;
    } else {
      // Chưa tồn tại → thêm mới
      order.products.push({
        product_id,
        size,
        quantity,
        price,
        discountPercentage
      });
    }

    // TÍNH LẠI TOTAL ORDER
    let totalOrder = 0;

    order.products.forEach(item => {
      const finalPrice =
        item.price * (1 - (item.discountPercentage || 0) / 100);
      totalOrder += finalPrice * item.quantity;
    });

    order.totalOrder = totalOrder;

    await order.save();

    // Trả kết quả
    res.json({
      code: 200,
      message: "Cập nhật sản phẩm trong đơn hàng thành công",
      data: {
        order
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
}

module.exports.removeProductToOrder = async (req, res) => {
  try {
    const { order_id, product_id, size } = req.body;

    if (!order_id || !product_id || !size) {
      return res.json({
        code: 400,
        message: "Thiếu dữ liệu bắt buộc"
      });
    }

    const order = await Order.findById(order_id);

    if (!order) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đơn hàng"
      });
    }

    if( order.status !== "initialize") {
      return res.json({
        code: 400,
        message: "Đơn hàng không ở trạng thái khởi tạo, không thể thay đổi!"
      });
    }

    const beforeLength = order.products.length;

    // Lọc bỏ product cần xóa
    order.products = order.products.filter(
      item => !(item.product_id === product_id && item.size === size)
    );

    if (order.products.length === beforeLength) {
      return res.json({
        code: 404,
        message: "Sản phẩm không tồn tại trong đơn hàng"
      });
    }

    // TÍNH LẠI TOTAL ORDER
    let totalOrder = 0;

    order.products.forEach(item => {
      const finalPrice =
        item.price * (1 - (item.discountPercentage || 0) / 100);
      totalOrder += finalPrice * item.quantity;
    });

    order.totalOrder = totalOrder;

    await order.save();

    return res.json({
      code: 200,
      message: "Xóa sản phẩm khỏi đơn hàng thành công",
      data: order
    });

  } catch (error) {
    console.error(error);
    return res.json({
      code: 400,
      message: "Lỗi: " + error.message
    });
  }
}