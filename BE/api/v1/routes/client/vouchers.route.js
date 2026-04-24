const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/vouchers.controller");

router.get("/", controller.index);

module.exports = router;