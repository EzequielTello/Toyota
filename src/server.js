import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import productRoutes from "./routes/productRoutes.js";
import { router } from "./routes/cartRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { chatHandlebarsRouter } from "./routes/chatHandlebarsRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import { homeHandlebarsRouter } from "./routes/homeHandlebarsRoutes.js";
import { realTimeProductsRouter } from "./routes/realTimeProductsHandlebarsRoutes.js";
import bodyParser from "body-parser";
import { Product } from "./dao/models/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

export let arrMessage = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/dao", "/public")));

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  socket.emit("welcome", "Bienvenido nuevo cliente");
  socket.on("new-message", (data) => {
    console.log("Nuevo mensaje recibido:", data);
    arrMessage.push(data);
    io.sockets.emit("message-all", arrMessage);
    console.log("Mensajes enviados a todos los clientes:", arrMessage);
  });

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
app.use("/products", productRoutes);
app.use("/chatHandlebars", chatHandlebarsRouter);
app.use("/carts", router);
app.use("/homeHandlebars", homeHandlebarsRouter);
app.use("/realTimeProductsHandlebars", realTimeProductsRouter);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
