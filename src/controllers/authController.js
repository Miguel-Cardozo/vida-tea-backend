import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// CADASTRO
export const register = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios."
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 6 caracteres."
      });
    }

    const sqlCheck = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sqlCheck, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Erro ao verificar usuário.",
          error: err.message
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "E-mail já cadastrado."
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const sqlInsert = `
        INSERT INTO usuarios (nome, email, senha, telefone)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sqlInsert, [nome, email, senhaHash, telefone || null], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Erro ao cadastrar usuário.",
            error: err.message
          });
        }

        return res.status(201).json({
          message: "Usuário cadastrado com sucesso!",
          usuario: {
            id: result.insertId,
            nome,
            email,
            telefone: telefone || null
          }
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno no servidor.",
      error: error.message
    });
  }
};

// LOGIN
export const login = (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios."
      });
    }

    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Erro ao buscar usuário.",
          error: err.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Usuário não encontrado."
        });
      }

      const usuario = results[0];

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          message: "Senha inválida."
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone
        }
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno no servidor.",
      error: error.message
    });
  }
};