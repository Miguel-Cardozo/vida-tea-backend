import express from "express";
import { enviarMensagem } from "../controllers/mensagemController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Rota mensagens funcionando!",
    EMAIL_USER: process.env.EMAIL_USER ? "OK" : "VAZIO",
    EMAIL_PASS: process.env.EMAIL_PASS ? "OK" : "VAZIO",
    EMAIL_DESTINO: process.env.EMAIL_DESTINO ? "OK" : "VAZIO",
    EMAIL_DESTIN0: process.env.EMAIL_DESTIN0 ? "OK" : "VAZIO",
  });
});

router.post("/", enviarMensagem);

export default router;