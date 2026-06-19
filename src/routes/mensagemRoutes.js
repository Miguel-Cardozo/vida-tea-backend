import express from "express";
import { enviarMensagem } from "../controllers/mensagemController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Rota mensagens funcionando"
  });
});

router.post("/", enviarMensagem);

export default router;