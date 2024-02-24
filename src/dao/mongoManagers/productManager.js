import { Product } from "../models/products.js";

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      let filter = {};
      if (query) {
        // Aquí puedes implementar la lógica para filtrar por la query
        // Por ejemplo, si la query es una cadena de texto para buscar en el nombre o descripción
        filter = {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        };
      }

      let sortOption = {};
      if (sort) {
        sortOption = { price: sort === "asc" ? 1 : -1 };
      }

      const skip = (page - 1) * limit;

      const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec();
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getTotalProductsCount() {
    try {
      const count = await Product.countDocuments();
      return count;
    } catch (error) {
      throw new Error("Error al contar los productos");
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
