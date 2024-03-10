import express from "express";
import usuarioManager from "../dao/mongoManagers/usuarioManager.js";

const loginHandlebarsRouter = express.Router();

loginHandlebarsRouter.use(express.urlencoded({ extended: true }));

loginHandlebarsRouter.get("/", (req, res) => {
  res.render("loginHandlebars");
});

loginHandlebarsRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let isAdmin = false;
    if (email === "admincoder@coder.com" && password === "adminCod3r123") {
      isAdmin = true;
    }
    console.log("El usuario es administrador:", isAdmin);
    const user = await usuarioManager.getUserByEmail(email);

    if (
      !user ||
      !(await usuarioManager.comparePassword(password, user.password))
    ) {
      console.log("Credenciales incorrectas");
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si las credenciales son válidas, establecer la sesión del usuario
    req.session.user = user;

    req.session.user.isAdmin = isAdmin;
    console.log("Usuario conectado:", user.username);
    // Redirigir al usuario a la vista de productos
    res.redirect("/productsHandlebars");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const registerHandlebarsRouter = express.Router();

registerHandlebarsRouter.use(express.urlencoded({ extended: true }));

registerHandlebarsRouter.get("/", (req, res) => {
  res.render("registerHandlebars");
});

registerHandlebarsRouter.post("/register", async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { username, email, password } = req.body;
    // Verificar si el usuario ya existe
    const existingUser = await usuarioManager.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Crear un nuevo usuario con contraseña hasheada
    const hashedPassword = await usuarioManager.hashPassword(password);
    let role = "usuario";
    if (email === "admincoder@coder.com" && password === "adminCod3r123") {
      role = "adminnistrador";
    }

    // Crear un nuevo usuario en la base de datos
    const nuevoUsuario = await usuarioManager.createUsuario({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.redirect("/loginHandlebars");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { loginHandlebarsRouter, registerHandlebarsRouter };
