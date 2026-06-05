const Product = require("../models/product");


exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
    });

    const result = await product.save();

    console.log("Product Created Successfully!");

    return res.status(201).json({
      message: "محصول با موفقیت ذخیره شد",
      productId: result._id
    });

  } catch (err) {
    console.log("Error saving product:", err);
    
    return res.status(500).json({
      message: "خطایی در سمت سرور رخ داد",
      error: err.message
    });
  }
};
