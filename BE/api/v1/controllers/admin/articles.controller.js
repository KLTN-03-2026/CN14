const Article = require("../../models/articles.model");
const Account = require("../../models/account.model");

// [GET] /articles
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page, sortKey, sortType } = req.query;
    // Bộ lọc mặc định
    let find = { deleted: false };
    if (status) find.status = status;

    // Phân trang
    const limitItems = parseInt(limit) || 5;
    const currentPage = parseInt(page) || 1;

    const countArticle = await Article.countDocuments(find);
    const totalPage = Math.ceil(countArticle / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Sắp xếp
    const sort = {};
    if (
      sortKey &&
      sortType &&
      sortKey !== "undefined" &&
      sortKey !== "default"
    ) {
      // Mongoose cho phép 'asc'/'desc' hoặc 1/-1
      sort[sortKey] = sortType === "desc" ? -1 : 1;
    }

    // Lấy danh sách
    const articles = await Article.find(find)
      .sort(sort)
      .limit(limitItems)
      .skip(skip)
      .lean();

    for (const item of articles) {
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
        articles,
        totalPage,
        currentPage,
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

// [POST] /articles/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position == "") {
      const countItem = await Article.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
      user_Id: req.userAuth.id
    }

    const article = new Article(req.body);
    await article.save();

    res.json({
      code: 200,
      message: "Tạo mới thành công",
      article: article
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [PATCH]] /articles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const dataEdit = req.body;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    await Article.updateOne({
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

// [GET] /articles/delete/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const article = await Article.findOne({ deleted: false, _id: id });

    res.json({
      code: 200,
      message: "Chi tiết bài viết",
      article: article
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [DELETE] /articles/detail/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const article = await Article.findOne({
      _id: id
    }).select("_id");

    if (!article) {
      res.json({
        code: 400,
        message: "Không tìm thấy bài viết!"
      });
      return;
    }

    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date()
    }
    await Article.updateOne({
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

// [GET] /api/v1/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    await Article.updateOne({
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