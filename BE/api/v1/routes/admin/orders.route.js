const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/orders.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

const { shippingFeeValid, shippingFeeValidationRules
} = require("../../validates/admin/shipping-fee");

router.get("/", checkPermission.checkPermission("orders_view"), controller.index);

router.get("/detail/:id", checkPermission.checkPermission("orders_view"), controller.detail);

router.get("/change-status/:status/:code", checkPermission.checkPermission("orders_edit"), controller.changeStatus);

router.get("/shipping-settings", checkPermission.checkPermission("orders_view"), controller.getShippingSettings);

router.patch("/shipping-settings", checkPermission.checkPermission("orders_view"),
  shippingFeeValidationRules, shippingFeeValid, controller.updateShippingSettings);

router.get("/products", checkPermission.checkPermission("orders_edit"),
  controller.products);

router.patch("/update-order", checkPermission.checkPermission("orders_edit"),
  controller.updateProductToOrder);

router.patch("/remove-product", checkPermission.checkPermission("orders_edit"),
  controller.removeProductToOrder);

module.exports = router;