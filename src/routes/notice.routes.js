import express from "express";
import {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";

const router = express.Router();

router.post("/", createNotice);
router.get("/", getAllNotices);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;
