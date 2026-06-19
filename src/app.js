import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import clinicaRoutes from "./routes/clinicaRoutes.js";
import { enviarMensagem } from "./controllers/mensagemController.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Vida TEA funcionando!" });
});

app.get("/mensagens", (req, res) => {
  res.json({ message: "Rota mensagens funcionando!" });
});

app.post("/mensagens", enviarMensagem);

app.use("/auth", authRoutes);
app.use("/clinicas", clinicaRoutes);

export default app;