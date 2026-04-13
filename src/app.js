import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Vida TEA funcionando!" });
});

app.use("/auth", authRoutes);

export default app;