const Product = require("../../models/product");

exports.postAddProduct = async (req, res) => {
  try {
    console.log(req.body)
    let { title, price, description, imageUrl, oldPrice, discount, inStock } =
      req.body;

    if (!title || !price || !description || !imageUrl) {
      return res.status(400).json({
        message: "فیلدهای ضروری کامل نیست",
      });
    }

    price = Number(price);
    discount = Number(discount);
    oldPrice =
      oldPrice !== undefined && oldPrice !== null ? Number(oldPrice) : null;

    inStock = inStock === true || inStock === "true";

    if (isNaN(price) || isNaN(discount)) {
      return res.status(400).json({
        message: "اعداد نامعتبر هستند",
      });
    }

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      oldPrice: oldPrice,
      discount: discount,
      inStock: inStock,
    });

    const result = await product.save();

    return res.status(201).json({
      message: "محصول با موفقیت ذخیره شد",
      productId: result._id,
      product: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "خطای سرور",
      error: err.message,
    });
  }
};
