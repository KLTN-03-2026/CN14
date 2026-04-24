const Campaign = require("../../models/campaign.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");

// [GET] /campaigns
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    // Bộ lọc mặc định
    let find = { deleted: false };
    if (status) find.status = status;

    // Phân trang
    const limitItems = parseInt(limit) || 5;
    const currentPage = parseInt(page) || 1;

    const countArticle = await Campaign.countDocuments(find);
    const totalPage = Math.ceil(countArticle / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Lấy danh sách
    const campaigns = await Campaign.find(find)
      .limit(limitItems)
      .skip(skip)
      .lean();

    for (const item of campaigns) {
      const account = await Account.findOne({ deleted: false, _id: item.createBy.user_Id });

      // add thêm key fullName vào item
      if (account) {
        item.createBy.fullName = account.fullName;
      }

      // add thêm key fullName vào updatedBy
      item.updatedBy = item.updatedBy.map(async (entry) => {
        const userUpdated = await Account.findOne({ _id: entry.user_Id });
        if (userUpdated) {
          return { ...entry, fullName: userUpdated.fullName }; // Thêm key fullName
        }
        return entry;
      });

      // Đợi tất cả các promise trong .map() hoàn thành
      item.updatedBy = await Promise.all(item.updatedBy);
    }

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        campaigns,
        totalPage
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

// [GET] /campaigns/materials
module.exports.materialsGet = async (req, res) => {
  try {
    const products = await Product.find({
      deleted: false,
      status: "active"
    }).select("_id title")

    const categories = await Category.find({
      deleted: false,
      status: "active"
    }).select("_id title")

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        products,
        categories,
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

// [POST] /campaigns/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position == "") {
      const countItem = await Campaign.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
      user_Id: req.userAuth.id
    }

    const campaign = new Campaign(req.body);
    await campaign.save();

    res.json({
      code: 200,
      message: "Tạo mới thành công",
      campaign: campaign
    });
  } catch (error) {
    console.log(error.message);
    
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }
}

// [PATCH]] /campaigns/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const dataEdit = req.body;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    await Campaign.updateOne({
      _id: id
    }, { ...dataEdit, $push: { updatedBy: updatedBy } }
    );

    res.json({
      code: 200,
      message: "Chỉnh sửa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message
    });
  }
}

// [GET] /campaigns/delete/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const campaign = await Campaign.findOne({ deleted: false, _id: id });

    res.json({
      code: 200,
      message: "Chi tiết chiến dịch",
      campaign: campaign
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [DELETE] /campaigns/detail/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await Campaign.findOne({
      _id: id
    }).select("_id");
    if (!campaign) {
      res.json({
        code: 400,
        message: "Không tìm thấy chiến dịch!"
      });
      return;
    }

    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date()
    }
    await Campaign.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy
    });

    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [GET] /api/v1/campaigns/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    await Campaign.updateOne({
      _id: id
    }, {
      status: status,
      $push: { updatedBy: updatedBy }
    })

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
}