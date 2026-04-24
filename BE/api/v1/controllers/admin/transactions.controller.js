const Transaction = require("../../models/transactions.model");
const searchHelper = require("../../../../helpers/search");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page, sortKey, sortType, provider, keyword } = req.query;

    // Bộ lọc mặc định
    let find = { };
    if (status !== "default") find.status = status;
    if (provider !== "default") find.provider = provider;

    // Phân trang
    const limitItems = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    const countRecord = await Transaction.countDocuments(find);
    const totalPage = Math.ceil(countRecord / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Tìm kiếm
    const searchData = searchHelper(req.query);
    if (searchData.keyword) {
      find = { ...find, ...searchData.condition };
    }
    
    // Sắp xếp
    const sort = { createdAt: -1 };
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
    const transactions = await Transaction.find(find)
      .sort(sort)
      .limit(limitItems)
      .skip(skip)
      .lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        transactions,
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