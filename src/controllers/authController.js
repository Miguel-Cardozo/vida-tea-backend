import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const sql = `
    INSERT INTO usuarios (nome, email, senha, tipo)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, senhaHash, tipo], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: "Usuário cadastrado!" });
  });
};

// LOGIN
export const login = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const usuario = results[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login ok", token });
  });
};