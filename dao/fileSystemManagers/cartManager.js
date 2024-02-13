import { promises as fs } from "fs";
import { join } from "path";

const CARTS_FILE_PATH = join(__dirname, "../../bd/carts.json");

class CartManager {
  async getCart(userId) {
    try {
      const cartsData = await fs.readFile(CARTS_FILE_PATH, "utf-8");
      const carts = JSON.parse(cartsData);
      const cart = carts.find((cart) => cart.userId === userId);
      return cart || { userId, products: [], totalPrice: 0 };
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async updateCart(cart) {
    try {
      const cartsData = await fs.readFile(CARTS_FILE_PATH, "utf-8");
      const carts = JSON.parse(cartsData);
      const index = carts.findIndex((c) => c.userId === cart.userId);
      if (index !== -1) {
        carts[index] = cart;
        await fs.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2));
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw new Error("Error al actualizar el carrito");
    }
  }
}

export default new CartManager();
