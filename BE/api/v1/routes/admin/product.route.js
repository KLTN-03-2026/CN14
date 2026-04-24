const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const { productValidationRules, productValid } = require("../../validates/admin/product.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("products_view"), controller.index);

router.get("/reviews/:product_id", checkPermission.checkPermission("products_view"),
  controller.getReviewsOfProduct);

router.get("/change-status/:status/:id", checkPermission.checkPermission("products_edit"),
  controller.changeStatus);

router.delete("/delete-item/:id", checkPermission.checkPermission("products_del"),
  controller.deleteItem);

router.post("/create-item", checkPermission.checkPermission("products_create"),
  productValidationRules, productValid, controller.createItem);

router.patch("/edit-item/:id", checkPermission.checkPermission("products_edit"),
  productValidationRules, productValid, controller.editPatch);

router.get("/detail/:id", checkPermission.checkPermission("products_view"),
  controller.detail);

// Reviews
router.post("/reviews/replies/:reviewId",
  controller.addReply);

router.delete("/reviews/delete/:reviewId",
  controller.deleteReview);

router.delete("/reviews/delete/:reviewId/:replyId",
  controller.deleteReply);

router.get("/reviews/change-deleted/:status/:id", checkPermission.checkPermission("products_view"),
  controller.changeDeleted);

router.delete("/reviews/delete-permanent/:id", checkPermission.checkPermission("products_view"),
  controller.permanentReview);

module.exports = router;