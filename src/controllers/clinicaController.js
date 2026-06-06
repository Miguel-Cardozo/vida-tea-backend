import db from "../config/db.js";

export const listarClinicas = (req, res) => {
  const sql = "SELECT * FROM clinicas";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao listar clínicas.", error: err.message });
    }

    return res.status(200).json(results);
  });
};

export const buscarClinicaPorId = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM clinicas WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar clínica.", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Clínica não encontrada." });
    }

    return res.status(200).json(results[0]);
  });
};