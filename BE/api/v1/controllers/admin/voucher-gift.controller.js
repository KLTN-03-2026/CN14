const searchHelper = require("../../../../helpers/search");
const VoucherGiftTemplate = require("../../models/voucher-gift-template.model");

// [GET] /api/v1/voucher-gifts
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page } = req.query;

    // Bộ lọc mặc định
    let find = { deleted: false };
    if (status) find.status = status;

    // Phân trang
    const limitItems = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    const countRecord = await VoucherGiftTemplate.countDocuments(find);
    const totalPage = Math.ceil(countRecord / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Lấy danh sách
    const voucherGifts = await VoucherGiftTemplate.find(find)
      .limit(limitItems)
      .skip(skip)
      .lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        voucherGifts,
        totalPage,
        currentPage,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
};

// [POST] /api/v1/voucher-gifts/create-item
module.exports.createItem = async (req, res) => {
  try {
    req.body.discount = parseFloat(req.body.discount);
    req.body.minOrderValue = parseFloat(req.body.minOrderValue);
    req.body.pointCost = Number(req.body.pointCost);

    req.body.createBy = {
      user_Id: req.userAuth.id,
    };

    const record = new VoucherGiftTemplate(req.body);
    await record.save();
    res.json({
      code: 200,
      message: "Tạo mới thành công",
      data: record,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo mới không thành công! - " + error,
    });
  }
};

// [GET] /api/v1/voucher-gifts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date(),
    };

    await VoucherGiftTemplate.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message,
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
};

// [PATCH] /api/v1/voucher-gifts/edit-item/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const { ...dataEdit } = req.body;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date(),
    };

    const updateQuery = {
      $set: dataEdit, // mọi field khác
      $push: { updatedBy }, // log lịch sử
    };

    await VoucherGiftTemplate.updateOne(
      {
        _id: id,
      },
      updateQuery
    );

    res.json({
      code: 200,
      message: "Chỉnh sửa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

// [DELETE] /api/v1/voucher-gifts/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const voucherGift = await VoucherGiftTemplate.findOne({ _id: id }).select("_id");

    if (!voucherGift) {
      res.json({
        code: 400,
        message: "Không tìm thấy thương hiệu!"
      });
      return;
    }

    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date(),
    };

    await VoucherGiftTemplate.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy
      }
    );

    res.json({
      code: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

