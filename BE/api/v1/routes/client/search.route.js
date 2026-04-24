const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/search.controller");
const { searchValidationRules, searchValid } = require("../../validates/client/search.validate");
const { createRateLimiter } = require("../../middlewares/apiLimiter.middleware");


router.get("/", createRateLimiter(30, 1),
  searchValidationRules, searchValid, controller.index);

router.get("/order/:code/:email", createRateLimiter(30, 1),
  controller.searchOrder);

module.exports = router;