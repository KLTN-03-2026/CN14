// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
const productRoute = require("./product.route");
const productCategoryRoute = require("./category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const darhBoardRoute = require("./dashboard.route");
const myAccountRoute = require("./my-account.route");
const settingRoute = require("./setting-general.route");
const userRoute = require("./user.route");
const orderRoute = require("./orders.route");
const articleRoute = require("./article.route");
const bannerRoute = require("./banner.route");
const voucherRoute = require("./voucher.route");
const trashRoute = require("./trash.route");
const campaignRoute = require("./campaign.route");
const transactionRoute = require("./transaction.route");
const voucherGiftRoute = require("./voucher-gift.route");
const contactRoute = require("./contact.route");
const authorRoute = require("./author.route");
const publisherRoute = require("./publisher.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const connectDb = require("../../middlewares/connectMongo.middware");

module.exports = (app) => {
  const prefixAdmin = "admin";

  app.use(connectDb.connectMongo);

  app.use(`/api/v1/${prefixAdmin}/products`, authMiddleware.requireAuth, productRoute);
  app.use(`/api/v1/${prefixAdmin}/products-category`, authMiddleware.requireAuth,
    productCategoryRoute);
  app.use(`/api/v1/${prefixAdmin}/auth`, authRoute);
  app.use(`/api/v1/${prefixAdmin}/roles`, authMiddleware.requireAuth, roleRoute);
  app.use(`/api/v1/${prefixAdmin}/accounts`, authMiddleware.requireAuth, accountRoute);
  app.use(`/api/v1/${prefixAdmin}/dashboard`, authMiddleware.requireAuth, darhBoardRoute);
  app.use(`/api/v1/${prefixAdmin}/my-account`, authMiddleware.requireAuth, myAccountRoute);
  app.use(`/api/v1/${prefixAdmin}/settings`, authMiddleware.requireAuth, settingRoute);
  app.use(`/api/v1/${prefixAdmin}/users`, authMiddleware.requireAuth, userRoute);
  app.use(`/api/v1/${prefixAdmin}/authors`, authMiddleware.requireAuth, authorRoute);
  app.use(`/api/v1/${prefixAdmin}/publishers`, authMiddleware.requireAuth, publisherRoute);
  app.use(`/api/v1/${prefixAdmin}/orders`, authMiddleware.requireAuth, orderRoute);
  app.use(`/api/v1/${prefixAdmin}/articles`, authMiddleware.requireAuth, articleRoute);
  app.use(`/api/v1/${prefixAdmin}/banners`, authMiddleware.requireAuth, bannerRoute);
  app.use(`/api/v1/${prefixAdmin}/vouchers`, authMiddleware.requireAuth, voucherRoute);
  app.use(`/api/v1/${prefixAdmin}/trashs`, authMiddleware.requireAuth, trashRoute);
  app.use(`/api/v1/${prefixAdmin}/campaigns`, authMiddleware.requireAuth, campaignRoute);
  app.use(`/api/v1/${prefixAdmin}/transactions`, authMiddleware.requireAuth, transactionRoute);
  app.use(`/api/v1/${prefixAdmin}/contacts`, authMiddleware.requireAuth, contactRoute);
  app.use(`/api/v1/${prefixAdmin}/voucher-gifts`, authMiddleware.requireAuth, voucherGiftRoute);

} 