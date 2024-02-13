import express from "express";
import MessageManager from "../mongoManagers/messageManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const messages = await MessageManager.getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newMessage = await MessageManager.addMessage(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto
router.delete("/eliminar/:id", async (req, res) => {
  try {
    const result = await MessageManager.deleteMessage(req.params.id);
    if (result) {
      res.json({ message: result });
    } else {
      res.status(402).json({ message: "Mensaje no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
