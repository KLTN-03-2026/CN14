const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/contact.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("campaigns_view"),
  controller.index);

router.post("/reply/:contact_id",
  checkPermission.checkPermission("campaigns_view"), controller.reply);

router.get("/change-status/:status/:id",
  checkPermission.checkPermission("campaigns_view"), controller.changeStatus);

module.exports = router;