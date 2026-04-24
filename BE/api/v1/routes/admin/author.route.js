const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/author.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("authors_view"), controller.index);

router.get("/all", checkPermission.checkPermission("authors_view"), controller.all);

router.delete("/delete-item/:id", checkPermission.checkPermission("authors_del"), controller.deleteItem);

router.post("/create-item", checkPermission.checkPermission("authors_create"), controller.createItem);

router.patch("/edit-item/:id", checkPermission.checkPermission("authors_edit"),controller.editPatch);

module.exports = router;