import Cart from "../models/carts.js";

class CartManager {
  async getCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId"
      );
      if (!cart) {
        throw new Error("Carrito no encontrado para el usuario especificado");
      }
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async createCart(userId) {
    try {
      const newCart = new Cart({ userId });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async addToCart(userId, products) {
    try {
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error(
          "Los productos deben ser proporcionados como un arreglo no vacío"
        );
      }

      let totalPrice = 0;
      for (const product of products) {
        if (!product.productId || !product.quantity) {
          throw new Error(
            "Cada producto debe tener un productId y una cantidad"
          );
        }
        // Aquí podrías agregar más validaciones según tus necesidades

        totalPrice += product.price * product.quantity;
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, products, totalPrice });
      } else {
        cart.products.push(...products);
        cart.totalPrice += totalPrice;
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar al carrito: " + error.message);
    }
  }
}
export default new CartManager();
