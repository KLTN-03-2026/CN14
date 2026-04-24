const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("users_view"), controller.index);

router.get("/change-status/:status/:id", checkPermission.checkPermission("users_edit"), controller.changeStatus);

router.delete("/delete/:idUser", checkPermission.checkPermission("users_del"), controller.delete);

router.get("/orders-by-user/:user_id", checkPermission.checkPermission("users_view"), controller.ordersByUser);

router.post("/send-notifications", checkPermission.checkPermission("users_view"),
  controller.sendNotifications);


module.exports = router;