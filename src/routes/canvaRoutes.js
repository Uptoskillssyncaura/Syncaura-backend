import express from "express";
import { handleExport } from "../controllers/canvaController.js";

const router = express.Router();

router.post("/export", handleExport);

export default router;
