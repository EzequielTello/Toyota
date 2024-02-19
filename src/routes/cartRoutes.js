import express from "express";
import CartManager from "../dao/mongoManagers/cartManager.js";

const router = express.Router();

// Obtener el carrito de un usuario
router.get("/:userId", async (req, res) => {
  try {
    const cart = await CartManager.getCart(req.params.userId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo carrito para un usuario
router.post("/:userId", async (req, res) => {
  try {
    const newCart = await CartManager.createCart(req.params.userId);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Agregar un producto al carrito de un usuario
router.post("/:userId/add", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await CartManager.addToCart(
      req.params.userId,
      productId,
      quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito de un usuario
router.put("/:userId/update/:productId", async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await CartManager.updateCartItem(
      req.params.userId,
      req.params.productId,
      quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto del carrito de un usuario
router.delete("/:userId/remove/:productId", async (req, res) => {
  try {
    const cart = await CartManager.removeFromCart(
      req.params.userId,
      req.params.productId
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router };
