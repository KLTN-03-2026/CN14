const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/publishers.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("publishers_view"), controller.index);

router.get("/all", checkPermission.checkPermission("publishers_view"), controller.all);


router.delete("/delete-item/:id", checkPermission.checkPermission("publishers_del"), controller.deleteItem);

router.post("/create-item", checkPermission.checkPermission("publishers_create"), controller.createItem);

router.patch("/edit-item/:id", checkPermission.checkPermission("publishers_edit"),controller.editPatch);

module.exports = router;