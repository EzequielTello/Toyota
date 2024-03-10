import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "usuario",
  },
  accessToken: String,
  refreshToken: String,
  githubId: String,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
