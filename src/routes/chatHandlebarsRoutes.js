import { Router } from "express";
import { arrMessage } from "../server.js";

const chatHandlebarsRouter = Router();

chatHandlebarsRouter.get("/", (req, res) => {
  res.render("chatHandlebars", { messages: arrMessage });
});

chatHandlebarsRouter.post("/", (req, res) => {
  const newMessage = req.body.message;
  arrMessage.push(newMessage);
  res.redirect("/chatHandlebars");
});

export { chatHandlebarsRouter };
