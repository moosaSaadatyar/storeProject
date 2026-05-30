const express = require("express");
const router = express.Router();

const postProductController = require("../controllers/addProducte.controler");

router.post("/product", postProductController.postAddProduct);

module.exports = router;
