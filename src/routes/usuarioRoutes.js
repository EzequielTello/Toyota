import express from "express";
import usuarioManager from "../dao/mongoManagers/usuarioManager.js";

const router = express.Router();

router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await usuarioManager.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/usuarios", async (req, res) => {
  try {
    const nuevoUsuario = await usuarioManager.createUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUsuario = await usuarioManager.updateUsuario(id, req.body);
    res.status(200).json(updatedUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usuarioManager.deleteUsuario(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
