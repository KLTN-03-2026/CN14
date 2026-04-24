const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/transactions.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("orders_view"), controller.index);

module.exports = router;