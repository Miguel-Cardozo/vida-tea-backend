import express from "express";
import { listarClinicas, buscarClinicaPorId } from "../controllers/clinicaController.js";

const router = express.Router();

router.get("/", listarClinicas);
router.get("/:id", buscarClinicaPorId);

export default router;