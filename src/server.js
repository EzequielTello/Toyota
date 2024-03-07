import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { router as productRoutes } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { chatHandlebarsRouter } from "./routes/chatHandlebarsRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import { homeHandlebarsRouter } from "./routes/homeHandlebarsRoutes.js";
import { realTimeProductsRouter } from "./routes/realTimeProductsHandlebarsRoutes.js";

import { Product } from "./dao/models/products.js";
import { MessageManager } from "./dao/mongoManagers/messageManager.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import {
  loginHandlebarsRouter,
  registerHandlebarsRouter,
} from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);
const messageManager = new MessageManager();

app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

export let arrMessage = [];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: false })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

const MONGODB_URI =
  "mongodb+srv://ezetello23:28octubre@cluster0.cagu7sv.mongodb.net/toyota";

mongoose
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  socket.emit("welcome", "Bienvenido nuevo cliente");

  socket.on("newMessage", async (msg) => {
    try {
      await messageManager.createMessage(msg);
      const messages = await messageManager.getMessages();
      socket.emit("allMessages", messages);
    } catch (err) {
      console.error("Error", err);
    }
  });
  const products = await Product.find();
  socket.emit("products", products);

  socket.on("newProduct", async (newProductData) => {
    try {
      // Crea un nuevo producto en la base de datos
      const newProduct = new Product(newProductData);
      await newProduct.save();

      // Emitir evento para notificar a los clientes sobre el nuevo producto
      io.emit("updateProducts", await Product.find());
    } catch (error) {
      console.error("Error al agregar un nuevo producto:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});
app.get("/", (req, res) => {
  res.redirect("/loginHandlebars");
});

app.use("/productsHandlebars", productRoutes);
app.use("/chatHandlebars", chatHandlebarsRouter);
app.use("/cartHandlebars", cartRouter);
app.use("/homeHandlebars", homeHandlebarsRouter);
app.use("/realTimeProductsHandlebars", realTimeProductsRouter);
app.use(usuarioRoutes);
app.use("/loginHandlebars", loginHandlebarsRouter);
app.use("/registerHandlebars", registerHandlebarsRouter);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
