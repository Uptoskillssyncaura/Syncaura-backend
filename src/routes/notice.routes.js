import express from "express";
import {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";
import {auth} from "../middlewares/auth.js"; // existing authentication middleware
import {permit} from "../middlewares/role.js"; // restrict access to admin/coadmin

const router = express.Router();

// View all notices (any authenticated user)
router.get("/", auth, getAllNotices);

//  Create a new notice (admin/coadmin only)
router.post("/", auth, permit, createNotice);

// Update a notice (admin/coadmin only)
router.put("/:id", auth, permit, updateNotice);

// Delete a notice (admin/coadmin only)
router.delete("/:id", auth, permit, deleteNotice);

export default router;
