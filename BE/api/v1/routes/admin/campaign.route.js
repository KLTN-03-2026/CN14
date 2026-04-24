const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/campaigns.controller");
const { articleValid, articleValidationRules } = require("../../validates/admin/articles.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("campaigns_view"), controller.index);

router.post("/create", checkPermission.checkPermission("campaigns_create"),
  // articleValidationRules, articleValid,
   controller.createPost);

router.get("/materials", checkPermission.checkPermission("campaigns_create"),
  controller.materialsGet);


router.get("/change-status/:status/:id", checkPermission.checkPermission("campaigns_edit"),
  controller.changeStatus);

router.patch("/edit/:id", checkPermission.checkPermission("campaigns_edit"),
  // articleValidationRules, articleValid, 
  controller.editPatch);

router.delete("/delete/:id", checkPermission.checkPermission("campaigns_del"), controller.delete);

router.get("/detail/:id", checkPermission.checkPermission("campaigns_view"), controller.detail);

module.exports = router;
