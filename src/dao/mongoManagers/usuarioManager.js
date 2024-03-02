import Usuario from "../models/usuario.js";

class UsuarioManager {
  async getAllUsuarios() {
    try {
      const usuarios = await Usuario.find();
      return usuarios;
    } catch (error) {
      throw new Error("Error al obtener los usuarios: " + error.message);
    }
  }

  async createUsuario(data) {
    try {
      const usuario = new Usuario(data);
      const savedUsuario = await usuario.save();
      return savedUsuario;
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  async updateUsuario(id, data) {
    try {
      const updatedUsuario = await Usuario.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedUsuario;
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  async deleteUsuario(id) {
    try {
      await Usuario.findByIdAndDelete(id);
      return { message: "Usuario eliminado exitosamente" };
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await Usuario.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(
        "Error al obtener el usuario por email: " + error.message
      );
    }
  }
}

export default new UsuarioManager();
