import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import productRoutes from "./dao/routes/productRoutes.js";
import { router } from "./dao/routes/cartRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { chatHandlebarsRouter } from "./dao/routes/chatHandlebarsRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import { homeHandlebarsRouter } from "./dao/routes/homeHandlebarsRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

let arrMessage = [];

app.use(
  express.static(path.join(__dirname, "dao", "public"), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: false })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "dao", "views"));

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
    arrMessage.push(data);
    io.sockets.emit("message-all", arrMessage);
  });
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use("/products", productRoutes);
app.use("/chatHandlebars", chatHandlebarsRouter);
app.use("/carts", router);
app.use("/homeHandlebars", homeHandlebarsRouter);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
