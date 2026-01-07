import express from "express";
import {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";
import auth from "../middlewares/auth.js"; // existing authentication middleware
import roleCheck from "../middlewares/rolecheck.js"; // restrict access to admin/coadmin

const router = express.Router();

// View all notices (any authenticated user)
router.get("/", auth, getAllNotices);

//  Create a new notice (admin/coadmin only)
router.post("/", auth, roleCheck, createNotice);

// Update a notice (admin/coadmin only)
router.put("/:id", auth, roleCheck, updateNotice);

// Delete a notice (admin/coadmin only)
router.delete("/:id", auth, roleCheck, deleteNotice);

export default router;
