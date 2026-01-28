import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:channelId", auth, getMessages);

export default router;