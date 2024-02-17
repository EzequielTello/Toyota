import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  code: String,
  quantity: Number,
});

export default mongoose.model("Product", productSchema);
