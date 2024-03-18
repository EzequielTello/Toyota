// githubController.js

import axios from "axios";
import Usuario from "../models/usuario.js";

// Función para obtener los repositorios de un usuario en GitHub
export const getRepositories = async (userId) => {
  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const response = await axios.get(
      `https://api.github.com/user/repos?access_token=${user.accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los repositorios:", error);
    throw error;
  }
};
