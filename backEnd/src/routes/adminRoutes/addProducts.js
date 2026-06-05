const express = require("express");
const router = express.Router();

const postProductController = require("../../controllers/addminControlers/addProducte.controler");

router.post("/product", postProductController.postAddProduct);

module.exports = router;
