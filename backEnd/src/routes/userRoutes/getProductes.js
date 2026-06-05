const express = require("express");
const router = express.Router();

const getProduct = require("../../controllers/userControlers/getProductControler");

router.get("/get-productes", getProduct.getIndex);

module.exports = router;
