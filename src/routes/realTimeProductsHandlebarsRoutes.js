// routes/realTimeProductsHandlebarsRoutes.js

import { Router } from "express";
import { Product } from "../dao/models/products.js";
import path from "path";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("realTimeProductsHandlebars", {
      products,
      styles: "/css/styles.css",
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export { realTimeProductsRouter };
