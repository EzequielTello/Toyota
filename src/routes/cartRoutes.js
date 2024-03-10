import express from "express";
import CartManager from "../dao/mongoManagers/cartManager.js";

const cartRouter = express.Router();

cartRouter.get("/", (req, res) => {
  res.render("cartHandlebars.handlebars");
});
// Obtener el carrito de un usuario
cartRouter.get("/:userId", async (req, res) => {
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
cartRouter.post("/:userId", async (req, res) => {
  try {
    const newCart = await CartManager.createCart(req.params.userId);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Agregar un producto al carrito de un usuario
cartRouter.post("/:userId/add", async (req, res) => {
  const { productId, title, description, price, quantity } = req.body;
  try {
    const products = [];
    products.push({
      productId: productId,
      title: title,
      description: description,
      price: price,
      quantity: quantity,
    });
    const cart = await CartManager.addToCart(req.params.userId, products);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito de un usuario
cartRouter.put("/:userId/update/:productId", async (req, res) => {
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
cartRouter.delete("/:userId/remove/:productId", async (req, res) => {
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

// Obtener el carrito de un usuario
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await CartManager.getCartWithProducts(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Eliminar un producto específico del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await CartManager.removeProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar todo el carrito
cartRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await CartManager.updateCart(cid, req.body);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { title, description, price, quantity } = req.body;
    const updatedCart = await CartManager.updateProductQuantity(
      cid,
      pid,
      title,
      description,
      price,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar todos los productos del carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await CartManager.removeAllProductsFromCart(cid);
    res.json({ message: "Todos los productos del carrito fueron eliminados" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Agregar un producto al carrito de un usuario desde la vista productsHandlebars
cartRouter.post("/add-to-cart", async (req, res) => {
  const { userId, productId, title, description, price, quantity } = req.body;
  try {
    // Lógica para agregar el producto al carrito
    const cart = await CartManager.addToCart(
      userId,
      productId,
      title,
      description,
      price,
      quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { cartRouter };
