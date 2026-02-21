import express from "express";
import auth from "../middleware/auth.middleware.js";
import * as controller from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/log", auth, controller.logActivity);
router.get("/", auth, controller.getActivities);
router.get("/test", controller.testData);

export default router;