// routes/githubRoutes.js

import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/loginHandlebars" }),
  (req, res) => {
    // Autenticación exitosa, redirige a la página deseada
    res.redirect("/homeHandlebars");
  }
);

export default router;
