import express from "express";
import ProductManager from "../dao/mongoManagers/productManager.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 2,
      sort,
      query,
      category,
      availability,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    // Lógica para buscar y paginar los productos según los parámetros proporcionados
    const products = await ProductManager.getProducts({
      limit,
      skip,
      sort,
      query,
      category,
      availability,
    });

    // Devolver el resultado con el formato especificado en tu pregunta
    const totalProducts = await ProductManager.getTotalProductsCount();
    const totalPages = Math.ceil(totalProducts / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const hasPrevPage = prevPage !== null;
    const hasNextPage = nextPage !== null;
    const prevLink = hasPrevPage
      ? `/productsHandlebars?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `/productsHandlebars?page=${nextPage}&limit=${limit}`
      : null;

    res.render("productsHandlebars.handlebars", {
      products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
      styles: "/css/styles.css",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductManager.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await ProductManager.updateProduct(
      req.params.id,
      req.body
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const result = await ProductManager.deleteProduct(req.params.id);
    if (result) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(402).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router };
