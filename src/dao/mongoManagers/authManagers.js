import passport from "passport";
import User from "../models/usuario.js";

export const githubLoginCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  User.findOne({ githubId: profile.id }, async (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        githubId: profile.id,
        username: profile.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      try {
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  });
};

// Controlador para el inicio de sesión local
export const login = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/loginHandlebars",
  failureFlash: true,
});

// Controlador para el registro de usuario
export const register = (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password,
  });

  // Guardar el nuevo usuario en la base de datos
  newUser
    .save()
    .then(() => {
      res.redirect("/loginHandlebars");
    })
    .catch((err) => {
      console.error("Error al registrar usuario:", err);

      res.redirect("/registerHandlebars");
    });
};
