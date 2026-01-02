import express from "express";
const router = express.Router();

import { auth } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";
import ROLES from "../config/roles.js";

import {
  createChannel,
  joinChannel,
  leaveChannel,
} from "../controllers/channelController.js";

router.post(
  "/",
  auth,
  permit(ROLES.ADMIN, ROLES.CO_ADMIN),
  createChannel
);

router.post("/:id/join", auth, joinChannel);
router.post("/:id/leave", auth, leaveChannel);

export default router;