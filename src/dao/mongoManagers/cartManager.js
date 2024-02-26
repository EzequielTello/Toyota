import Cart from "../models/carts.js";
import { generateUserID } from "../../utils/userUtils.js";

class CartManager {
  async getCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId"
      );
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async createCart(userId) {
    try {
      const userId = generateUserID();
      const newCart = new Cart({ userId });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async addToCart(userId, productId, quantity) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { products: { productId, quantity } } },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error al agregar al carrito");
    }
  }

  async updateCartItem(userId, productId, quantity) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId, "products.productId": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar el elemento del carrito");
    }
  }

  async removeFromCart(userId, productId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error al eliminar del carrito");
    }
  }
}

export default new CartManager();
