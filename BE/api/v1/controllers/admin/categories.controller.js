const Category = require("../../models/category.model");

// [GET] /api/v1/products-category
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page, sortKey, sortType } = req.query;

    // Bộ lọc mặc định
    let find = { deleted: false };
    if (status !== "default") find.status = status;

    // Phân trang
    const limitItems = parseInt(limit) || 5;
    const currentPage = parseInt(page) || 1;

    const countProductCate = await Category.countDocuments(find);
    const totalPage = Math.ceil(countProductCate / limitItems);
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
    const productCategories = await Category.find(find)
      .sort(sort)
      .limit(limitItems)
      .skip(skip);

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        productCategories,
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
};

// [GET] /api/v1/products-category
module.exports.all = async (req, res) => {
  try {
    let find = { deleted: false };
    const productCategories = await Category.find(find).select("title _id").lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: productCategories
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
};

// [POST] /api/v1/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position) {
      const countItem = await Category.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.body.parent_id) {
      const existCategory = await Category.findOne({ _id: req.body.parent_id });
      if (existCategory) {
        const record = new Category(req.body);
        await record.save();

        res.json({
          code: 200,
          message: "Thêm mới thành công!",
          productsCategory: record
        });
      }
    } else {
      const record = new Category(req.body);
      await record.save();

      res.json({
        code: 200,
        message: "Thêm mới thành công!",
        productsCategory: record
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thêm mới không thành công!"
    });
  }
}

// [PATCH] /api/v1/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });

    if (category) {
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;

      await Category.updateOne({
        _id: id
      }, dataEdit);

      res.json({
        code: 200,
        message: "Chỉnh sửa thành công!"
      });
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Chỉnh sửa không thành công!"
    });
  }
}

// [DELETE] /api/v1/products-category/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });

    if (!category) {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!"
      });
      return;
    }
    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date(),
    };
    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deteledAt: new Date(),
      deletedBy: deletedBy
    });

    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}

// [GET] /api/v1/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Category.updateOne({
      _id: id
    }, {
      status: status
    })

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}
