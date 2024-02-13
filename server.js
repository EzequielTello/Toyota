import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import productRoutes from "./dao/routes/productRoutes.js";
import { router } from "./dao/routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: false })
);
app.set("view engine", "handlebars");

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

app.use("/products", productRoutes);

app.use("/carts", router);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
