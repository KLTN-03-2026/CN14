const Author = require("../../models/author.model");
const searchHelper = require("../../../../helpers/search");
const Account = require("../../models/account.model");

// [GET] /api/v1/authors
module.exports.index = async (req, res) => {
    try {
        const { status, limit, page, sortKey, sortType } = req.query;

        // Bộ lọc mặc định
        let find = { deleted: false };
        if (status !== "default") find.status = status;

        // Phân trang
        const limitItems = parseInt(limit) || 10;
        const currentPage = parseInt(page) || 1;

        const countProduct = await Author.countDocuments(find);
        const totalPage = Math.ceil(countProduct / limitItems);
        const skip = (currentPage - 1) * limitItems;

        // Tìm kiếm
        const searchData = searchHelper(req.query);
        if (searchData.keyword) {
            find = { ...find, ...searchData.condition };
        }

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
        const authors = await Author.find(find)
            .sort(sort)
            .limit(limitItems)
            .skip(skip)
            .lean();

        for (const item of authors) {
            const account = await Account.findOne({
                deleted: false,
                _id: item.createBy.user_Id,
            });

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
                authors,
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

// [POST] /api/v1/authors/create-item
module.exports.createItem = async (req, res) => {
    try {
        req.body.createBy = {
            user_Id: req.userAuth.id,
        };

        const author = new Author(req.body);
        await author.save();
        res.json({
            code: 200,
            message: "Tạo mới thành công",
            data: author,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo mới tác giả không thành công! - " + error,
        });
    }
};

// [PATCH] /api/v1/authors/edit-item/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedBy = {
            user_Id: req.userAuth.id,
            updatedAt: new Date(),
        };

        const updateQuery = {
            $set: req.body, // mọi field khác
            $push: { updatedBy }, // log lịch sử
        };

        await Author.updateOne(
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
            message: "Lỗi chỉnh sửa! - " + error.message,
        });
    }
};

// [DELETE] /api/v1/authors/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        const author = await Author.findOne({ _id: id }).select("_id");

        if (!author) {
            res.json({
                code: 400,
                message: "Không tồn tại tác giả!"
            });
            return;
        }

        const deletedBy = {
            user_Id: req.userAuth.id,
            deletedAt: new Date(),
        };

        await Author.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedAt: new Date(),
                deletedBy: deletedBy,
            }
        );

        res.json({
            code: 200,
            message: "Xóa thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi xóa! - " + error.message,
        });
    }
};

// [GET] /api/v1/authors/all
module.exports.all = async (req, res) => {
  try {
    let find = { deleted: false };
    const authors = await Author.find(find).select("_id fullName").lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: authors
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
};