import Usuario from "../models/usuario.js";

export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile
) => {
  try {
    let usuario = await Usuario.findOne({ githubId: profile.id });
    if (!usuarioRoutes) {
      usuario = new Usuario({
        githubId: profile.id,
        username: profile.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      await usuario.save();
    }
    return usuario;
  } catch (error) {
    throw new Error("Error en la autenticación de GitHub: " + error.message);
  }
};
