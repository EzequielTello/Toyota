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
import passport from "passport";
import { Product } from "./dao/models/products.js";
import { MessageManager } from "./dao/mongoManagers/messageManager.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import {
  loginHandlebarsRouter,
  registerHandlebarsRouter,
} from "./routes/authRoutes.js";
import GitHubStrategy from "passport-github";
import githubRoutes from "./routes/githubRoutes.js";
import Usuario from "./dao/models/usuario.js";
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
app.use(passport.initialize());
app.use(passport.session());

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
passport.use(
  new GitHubStrategy(
    {
      clientID: "ef3a3cc612943d8792d6",
      clientSecret: "cf8bf3a4b761a18435f990d032b470c79ea2924a",
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Usuario.findOne({ githubId: profile.id });
        if (!user) {
          user = new Usuario({
            githubId: profile.id,
            username: profile.username,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/homeHandlebars"); // Redirige a la página principal
  } else {
    res.redirect("/loginHandlebars");
  }
});

// Ruta para iniciar sesión con GitHub
app.get("/auth/github", passport.authenticate("github"));

// Callback de autenticación de GitHub
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/loginHandlebars" }),
  (req, res) => {
    // Autenticación exitosa, redirige a la página deseada
    res.redirect("/homeHandlebars");
  }
);
app.use("/github", githubRoutes);
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
