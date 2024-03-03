import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";
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
  async hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error al cifrar la contraseña: " + error.message);
    }
  }
  async comparePassword(password, hashedPassword) {
    try {
      console.log("Comparando contraseñas...");
      console.log("Contraseña proporcionada:", password);
      console.log("Contraseña almacenada:", hashedPassword);

      const match = await bcrypt.compare(password, hashedPassword);
      console.log("Coincide:", match);

      return match;
    } catch (error) {
      throw new Error("Error al comparar contraseñas: " + error.message);
    }
  }
}

export default new UsuarioManager();
