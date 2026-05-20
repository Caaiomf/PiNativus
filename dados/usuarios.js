import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export async function salvarUsuarios(usuarios) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(usuarios, null, 2), "utf8");
}

export async function carregarUsuarios() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let usuarios = [];

  try {
    usuarios = JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
  } catch {
    usuarios = [];
  }

  usuarios = usuarios
    .map((usuario) => ({
      ...usuario,
      id: usuario.id || crypto.randomUUID(),
      nome: usuario.nome || usuario.name || "Usuario",
      tipo: usuario.tipo || usuario.role || "cliente",
      senha: usuario.senha || usuario.password || (usuario.email === "funcionario@nativus.com.br" ? "Nativus@123" : "123456")
    }))
    .filter((usuario) => usuario.email && usuario.senha);

  if (!usuarios.some((u) => u.email === "funcionario@nativus.com.br")) {
    usuarios.push({
      id: crypto.randomUUID(),
      nome: "Funcionario Nativus",
      email: "funcionario@nativus.com.br",
      senha: "Nativus@123",
      tipo: "funcionario"
    });
  }

  await salvarUsuarios(usuarios);
  return usuarios;
}
