const User = require("../../models/users.model");
const Order = require("../../models/order.model");
const VoucherGift = require("../../models/voucher-gift.model");
const { sendMultipleMail } = require("../../../../helpers/sendMail");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const records = await User.find(find).select("-password -tokenUser");

  res.json({
    code: 200,
    message: "Trang tài khoản người dùng",
    records: records
  });
}

// [GET] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const user = await User.findOne({
      _id: id
    });

    if (user) {
      await User.updateOne({
        _id: id
      }, {
        status: status
      });
      res.json({
        code: 200,
        message: "Thay đổi trạng thái thành công"
      });
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại user!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!"
    });
  }
}

// [DELETE] /admin/users/delete/:idUser
module.exports.delete = async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const user = await User.findOne({ _id: idUser, deleted: false });

    if (user) {
      await User.updateOne({ _id: idUser }, { deleted: true });

      res.json({
        code: 200,
        message: "Xóa tài khoản thành công"
      });
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại user!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params!"
    });
  }
}

// [GET] /admin/users/detail/:user_id
module.exports.ordersByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const orders = await Order.find({
      user_id: user_id
    }).sort({ createdAt: -1 })
      .select("-updatedAt -products -userInfo")
      .lean();

    const voucherGifts = await VoucherGift.find({
      owner: user_id
    });

    res.json({
      code: 200,
      message: "Chi tiết đơn hàng của khách hàng",
      data: {
        orders: orders,
        voucherGifts: voucherGifts
      }
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }
}

// [POST] /admin/users/send-notifications
module.exports.sendNotifications = async (req, res) => {
  try {
    const { emails, title, content } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Danh sách email không hợp lệ!",
      });
    }
    const result = await sendMultipleMail(emails, title, content);

    return res.json({
      code: 200,
      message: `Đã gửi xong ${result.total} email: ${result.success} thành công, ${result.failed} thất bại.`,
      data: result.detail,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      message: "Lỗi máy chủ khi gửi email!" + error.message,
    });
  }
}