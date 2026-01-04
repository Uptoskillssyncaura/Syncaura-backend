const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { listUsers, updateUserRole, getAllNotices } = require('../controllers/admin.controller');

// Admin and coadmin can manage notices
router.get('/notices', auth, authorize(['admin','coadmin']), getAllNotices);
const { createNotice } = require('../controllers/notice.controller');
router.post('/notices', auth, authorize(['admin','coadmin']), createNotice);

// optional: admin/coadmin can also update/delete via admin router if desired
const { updateNotice, deleteNotice } = require('../controllers/notice.controller');
router.put('/notices/:id', auth, authorize(['admin','coadmin']), updateNotice);
router.delete('/notices/:id', auth, authorize(['admin','coadmin']), deleteNotice);

// Admin-only user management
router.get('/users', auth, authorize(['admin']), listUsers);
router.put('/users/:id/role', auth, authorize(['admin']), updateUserRole);

module.exports = router;
