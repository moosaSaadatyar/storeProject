const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const prodactSchima = new moongose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  description: String,
  imageUrl: { type: String, requierd: true },
});

module.exports = mongoose.model("Product", prodactSchima);
