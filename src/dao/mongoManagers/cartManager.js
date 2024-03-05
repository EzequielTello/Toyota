import Cart from "../models/carts.js";

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
      const newCart = new Cart({ userId });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async addToCart(userId, products) {
    try {
      console.log(products);
      if (!Array.isArray(products)) {
        throw new Error("El parámetro 'products' debe ser un arreglo.");
      }
      // Verifica si el carrito existe para el usuario
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        // Si no existe, crea un nuevo carrito
        cart = new Cart({ userId, products: [] });
      }

      // Agrega cada producto al carrito
      for (const product of products) {
        cart.products.push(product);
      }

      // Calcula el totalPrice del carrito
      cart.totalPrice = cart.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      // Guarda los cambios en el carrito
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error("Error al agregar al carrito: " + error.message);
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
