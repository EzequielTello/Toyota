import { Product } from "../models/products.js";

class ProductManager {
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar el producto");
    }
  }

  async updateProduct(id, updatedData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

export default new ProductManager();
