import express from "express";
import usuarioManager from "../dao/mongoManagers/usuarioManager.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});
// Ruta para el login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Buscar el usuario  por correo electrónico
    const user = await usuarioManager.getUserByEmail(email);

    // Verificar si se encontró un usuario y si la contraseña coincide
    if (!user || user.password !== password) {
      // Si las credenciales son incorrectas, devolver un mensaje de error
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si las credenciales son válidas, establecer la sesión del usuario
    req.session.user = user;

    // Redirigir al usuario a la vista de productos
    res.redirect("/homeHandlebars");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});
// Ruta para el registro de usuarios
router.post("/register", async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { username, email, password } = req.body;

    // Validar los datos de entrada (por ejemplo, verificar que el email sea único)

    // Crear un nuevo usuario en la base de datos
    const nuevoUsuario = await usuarioManager.createUsuario({
      username,
      email,
      password,
    });

    // Enviar una respuesta de éxito
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el registro
    res.status(400).json({ message: error.message });
  }
});

export default router;
