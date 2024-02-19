import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  code: String,
  quantity: Number,
});

const Product = mongoose.model("Product", productSchema);

export { Product };
