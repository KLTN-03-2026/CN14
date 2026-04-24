const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/voucher-gift.controller");
const { voucherGiftValid, voucherGiftValidationRules } = require("../../validates/admin/voucher-gift.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("vouchers_view"), controller.index);

router.get("/change-status/:status/:id", checkPermission.checkPermission("vouchers_edit"),
  controller.changeStatus);

router.delete("/delete-item/:id", checkPermission.checkPermission("vouchers_del"),
  controller.deleteItem);

router.post("/create-item", checkPermission.checkPermission("vouchers_create"),
  voucherGiftValidationRules, voucherGiftValid,
  controller.createItem);

router.patch("/edit-item/:id", checkPermission.checkPermission("vouchers_edit"),
  voucherGiftValidationRules, voucherGiftValid,
  controller.editPatch);

module.exports = router;