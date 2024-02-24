// routes/realTimeProductsHandlebarsRoutes.js

import { Router } from "express";
import { Product } from "../dao/models/products.js";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("realTimeProductsHandlebars.handlebars", {
      products,
      styles: "/css/styles.css",
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export { realTimeProductsRouter };
