const express = require('express');
const router = express.Router();
const { createNotice, getNotices, getNotice, updateNotice, deleteNotice } = require('../controllers/notice.controller');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

router.get('/', getNotices);
router.post('/', auth, authorize(['admin','coadmin']), createNotice);
router.get('/:id', getNotice);
router.put('/:id', auth, authorize(['admin','coadmin']), updateNotice);
router.delete('/:id', auth, authorize(['admin','coadmin']), deleteNotice);

module.exports = router;
