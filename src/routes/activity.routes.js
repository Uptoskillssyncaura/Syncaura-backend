const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/activity.controller");

router.post("/log", auth, controller.logActivity);
router.get("/", auth, controller.getActivities);
router.get("/test", controller.testData);

module.exports = router;
public.key  