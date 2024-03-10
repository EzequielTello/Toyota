// routes/githubRoutes.js

import express from "express";
import { getRepositories } from "../dao/mongoManagers/githubManagers.js";

const router = express.Router();

// Definir las rutas relacionadas con GitHub
router.get("/repositories/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const repositories = await getRepositories(userId);
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los repositorios" });
  }
});

export default router;
