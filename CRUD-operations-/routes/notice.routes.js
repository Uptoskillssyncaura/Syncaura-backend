const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notice.controller");

router.post("/", noticeController.createNotice);
router.get("/", noticeController.getAllNotices);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;
