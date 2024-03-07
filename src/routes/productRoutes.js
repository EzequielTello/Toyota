import express from "express";
import ProductManager from "../dao/mongoManagers/productManager.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
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

      // Lógica para buscar y paginar los productos según los parámetros proporcionados
      const products = await ProductManager.getProducts({
        page,
        limit,
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
        user: req.session.user,
      });
    } else {
      // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
      res.redirect("/loginHandlebars");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/productos", async (req, res) => {
  try {
    // Obtener los productos de la base de datos
    const productos = await productos.find();

    // Renderizar la vista de productos y pasar los datos del usuario y los productos a la vista
    res.render("productsHandlebars", {
      user: req.session.user,
      productos: productos,
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

router.get("/logout", (req, res) => {
  res.redirect("/homeHandlebars");
});
export { router };
