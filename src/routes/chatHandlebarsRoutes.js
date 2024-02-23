import { Router } from "express";
import { MessageManager } from "../dao/mongoManagers/messageManager.js";

const messageManager = new MessageManager();

const chatHandlebarsRouter = new Router();

chatHandlebarsRouter.get("/chat", async (req, res) => {
  try {
    const msgs = await messageManager.getMessages();
    const chat = { msgs };
    res.render("chatHandlebars.handlebars", chat);
  } catch (error) {
    return err;
  }
});

export { chatHandlebarsRouter };
