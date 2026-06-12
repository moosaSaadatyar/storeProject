const productModel = require("../../models/product");

exports.getIndex = async (req, res, next) => {
  try {
    const products = await productModel.find();    
    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطایی در سمت سرور رخ داد",
      error: error.message,
    });
  }
};
 

