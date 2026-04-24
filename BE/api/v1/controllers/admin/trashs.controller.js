const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const User = require("../../models/users.model");
const Article = require("../../models/articles.model");
const Account = require("../../models/account.model");
const Banner = require("../../models/banner.model");
const Campaign = require("../../models/campaign.model");
const VoucherGiftTemplate = require("../../models/voucher-gift-template.model");
const Voucher = require("../../models/voucher.model");
const Cart = require("../../models/carts.model");
const Review = require("../../models/review.model");
const panigationHelper = require("../../../../helpers/pagination");
const searchHelper = require("../../../../helpers/search");
const mongoose = require("mongoose");

// [GET] /trashs/:typeItem
module.exports.items = async (req, res) => {
  try {
    const limitItem = req.query.limit;
    let find = {
      deleted: true
    };

    // phân trang 
    let initPagination = {
      currentPage: 1,
      limitItems: limitItem
    };

    // Tìm kiếm
    const searchData = searchHelper(req.query);

    if (searchData.keyword) {
      find = { ...find, ...searchData.condition };
    }
    // end Tìm kiếm

    const accounts = await Account.find().select("_id fullName")

    const typeItem = req.params.typeItem
    let data;
    let totalPage;
    switch (typeItem) {
      case "products":
        {
          const count = await Product.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const products = await Product.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          products.forEach(product => {
            const account = accounts.find(
              (i) => i._id.toString() === product.deletedBy.user_Id
            );
            if (account) {
              product.deletedBy.fullName = account.fullName;
            }
          });
          totalPage = objetPagination.totalPage
          data = products;
        }
        break;

      case "categories":
        {
          const count = await Category.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const categories = await Category.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          categories.forEach(category => {
            const account = accounts.find(
              (i) => i._id.toString() === category.deletedBy.user_Id
            );
            if (account) {
              category.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = categories;
        }
        break;

      case "articles":
        {
          const count = await Article.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const articles = await Article.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          articles.forEach(article => {
            const account = accounts.find(
              (i) => i._id.toString() === article.deletedBy.user_Id
            );
            if (account) {
              article.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = articles;
        }
        break;

      case "banners":
        {
          const count = await Banner.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const banners = await Banner.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          banners.forEach(banner => {
            const account = accounts.find(
              (i) => i._id.toString() === banner.deletedBy.user_Id
            );
            if (account) {
              banner.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = banners;
        }
        break;

      case "users":
        {
          const count = await User.countDocuments({ deleted: true });
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const users = await User.find({ deleted: true })
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("fullName email phone avatar");
          totalPage = objetPagination.totalPage
          data = users;
        }
        break;

      case "accounts":
        {
          const count = await Account.countDocuments({ deleted: true });
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const accounts = await Account.find({ deleted: true })
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("fullName email phone avatar");
          totalPage = objetPagination.totalPage
          data = accounts;
        }
        break;

      case "vouchers":
        {
          const count = await Voucher.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const vouchers = await Voucher.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          vouchers.forEach(voucher => {
            const account = accounts.find(
              (i) => i._id.toString() === voucher.deletedBy.user_Id
            );
            if (account) {
              voucher.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = vouchers;
        }
        break;

      case "campaigns":
        {
          const count = await Campaign.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const campaigns = await Campaign.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          campaigns.forEach(campaign => {
            const account = accounts.find(
              (i) => i._id.toString() === campaign.deletedBy.user_Id
            );
            if (account) {
              campaign.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = campaigns;
        }
        break;

      case "voucher-gifts":
        {
          const count = await VoucherGiftTemplate.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const voucherGifts = await VoucherGiftTemplate.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id deletedBy");

          voucherGifts.forEach(voucher => {
            const account = accounts.find(
              (i) => i._id.toString() === voucher.deletedBy.user_Id
            );
            if (account) {
              voucher.deletedBy.fullName = account.fullName;
            }
          });

          totalPage = objetPagination.totalPage
          data = voucherGifts;
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      data: data,
      totalPage: totalPage
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }
}

// [GET] /trashs/restore/:typeItem/:idItem
module.exports.restoreItem = async (req, res) => {
  try {
    const typeItem = req.params.typeItem
    const idItem = req.params.idItem;

    switch (typeItem) {
      case "product":
        {
          const product = await Product.findByIdAndUpdate(idItem, { deleted: false });

          if (!product) {
            res.json({
              code: 404,
              message: "Không tồn tại sản phẩm"
            });
            return;
          }
        }
        break;

      case "category":
        {
          const category = await ProductCategory.findByIdAndUpdate(idItem, { deleted: false });

          if (!category) {
            res.json({
              code: 404,
              message: "Không tồn tại danh mục"
            });
            return;
          }
        }
        break;

      case "article":
        {
          const article = await Article.findByIdAndUpdate(idItem, { deleted: false });

          if (!article) {
            res.json({
              code: 404,
              message: "Không tồn tại bài viết"
            });
            return;
          }
        }
        break;

      case "banner":
        {
          const banner = await Banner.findByIdAndUpdate(idItem, { deleted: false });

          if (!banner) {
            res.json({
              code: 404,
              message: "Không tồn tại quảng cáo"
            });
            return;
          }
        }
        break;

      case "voucher":
        {
          const voucher = await Voucher.findByIdAndUpdate(idItem, { deleted: false });

          if (!voucher) {
            res.json({
              code: 404,
              message: "Không tồn tại voucher"
            });
            return;
          }
        }
        break;

      case "account":
        {
          const account = await Account.findByIdAndUpdate(idItem, { deleted: false });

          if (!account) {
            res.json({
              code: 404,
              message: "Không tồn tại account"
            });
            return;
          }
        }
        break;

      case "user":
        {
          const user = await User.findByIdAndUpdate(idItem, { deleted: false });

          if (!user) {
            res.json({
              code: 404,
              message: "Không tồn tại user"
            });
            return;
          }
        }
        break;

      case "brand":
        {
          const brand = await Brand.findByIdAndUpdate(idItem, { deleted: false });

          if (!brand) {
            res.json({
              code: 404,
              message: "Không tồn tại thương hiệu"
            });
            return;
          }
        }
        break;

      case "campaign":
        {
          const campaign = await Campaign.findByIdAndUpdate(idItem, { deleted: false });

          if (!campaign) {
            res.json({
              code: 404,
              message: "Không tồn tại chiến lược"
            });
            return;
          }
        }
        break;

      case "voucher-gift":
        {
          const voucherGift = await VoucherGiftTemplate.findByIdAndUpdate(idItem, { deleted: false });

          if (!voucherGift) {
            res.json({
              code: 404,
              message: "Không tồn tại phiếu quà tặng"
            });
            return;
          }
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      message: "Khôi phục thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }
}

// [GET] /trashs/permanent-delete/:typeItem/:idItem
module.exports.permanentItem = async (req, res) => {
  try {
    const typeItem = req.params.typeItem
    const idItem = req.params.idItem;

    switch (typeItem) {
      case "product":
        {
          const product = await Product.findByIdAndDelete(idItem);

          if (!product) {
            res.json({
              code: 404,
              message: "Không tồn tại sản phẩm"
            });
            return;
          }

          // Xóa tất cả review có product = id sản phẩm
          await Review.deleteMany({
            product: new mongoose.Types.ObjectId(String(product._id))
          });

          // Xóa sản phẩm khỏi tất cả giỏ hàng
          await Cart.updateMany(
            {},
            { $pull: { products: { product_id: String(product._id) } } }
          );
        }
        break;

      case "category":
        {
          const category = await ProductCategory.findByIdAndDelete(idItem);

          if (!category) {
            res.json({
              code: 404,
              message: "Không tồn tại danh mục"
            });
            return;
          }
        }
        break;

      case "article":
        {
          const article = await Article.findByIdAndDelete(idItem);

          if (!article) {
            res.json({
              code: 404,
              message: "Không tồn tại bài viết"
            });
            return;
          }
        }
        break;

      case "banner":
        {
          const banner = await Banner.findByIdAndDelete(idItem);

          if (!banner) {
            res.json({
              code: 404,
              message: "Không tồn tại quảng cáo"
            });
            return;
          }
        }
        break;

      case "voucher":
        {
          const voucher = await Voucher.findByIdAndDelete(idItem);

          if (!voucher) {
            res.json({
              code: 404,
              message: "Không tồn tại voucher"
            });
            return;
          }
        }
        break;

      case "account":
        {
          const account = await Account.findByIdAndDelete(idItem);

          if (!account) {
            res.json({
              code: 404,
              message: "Không tồn tại account"
            });
            return;
          }
        }
        break;

      case "user":
        {
          const user = await User.findByIdAndDelete(idItem);

          if (!user) {
            res.json({
              code: 404,
              message: "Không tồn tại user"
            });
            return;
          }

          // Xóa tất cả review có product = id sản phẩm
          await Cart.deleteOne(user._id);
        }
        break;

      case "brand":
        {
          const brand = await Brand.findByIdAndDelete(idItem);

          if (!brand) {
            res.json({
              code: 404,
              message: "Không tồn tại thương hiệu"
            });
            return;
          }
        }
        break;

      case "campaign":
        {
          const campaign = await Campaign.findByIdAndDelete(idItem);

          if (!campaign) {
            res.json({
              code: 404,
              message: "Không tồn tại chiến lược"
            });
            return;
          }
        }
        break;

      case "voucher-gift":
        {
          const voucherGift = await VoucherGiftTemplate.findByIdAndDelete(idItem);

          if (!voucherGift) {
            res.json({
              code: 404,
              message: "Không tồn tại phiếu quà tặng"
            });
            return;
          }
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      message: "Xóa vĩnh viễn thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }

}
