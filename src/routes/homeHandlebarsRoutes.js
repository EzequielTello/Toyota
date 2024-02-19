import express from "express";
import { Product } from "../dao/models/products.js";

const homeHandlebarsRouter = express.Router();

homeHandlebarsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Productos resuperados:", products);
    res.render("homehandlebars", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export { homeHandlebarsRouter };
