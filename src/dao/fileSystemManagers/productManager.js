import { promises as fs } from "fs";
import { join } from "path";

const PRODUCTS_FILE_PATH = join(__dirname, "../../bd/products.json");

class ProductManager {
  async getProducts() {
    try {
      const productsData = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
      return JSON.parse(productsData);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      const productsData = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
      const products = JSON.parse(productsData);
      return products.find((product) => product.id === id);
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw new Error("Error al obtener el producto");
    }
  }

  async addProduct(product) {
    try {
      const productsData = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
      const products = JSON.parse(productsData);
      products.push(product);
      await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw new Error("Error al agregar el producto");
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      const productsData = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
      let products = JSON.parse(productsData);
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProductData };
        await fs.writeFile(
          PRODUCTS_FILE_PATH,
          JSON.stringify(products, null, 2)
        );
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const productsData = await fs.readFile(PRODUCTS_FILE_PATH, "utf-8");
      let products = JSON.parse(productsData);
      products = products.filter((product) => product.id !== id);
      await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw new Error("Error al eliminar el producto");
    }
  }
}

export default ProductManager;
