import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { listUsers, updateUserRole, getAllNotices } from '../controllers/admin.controller.js';

// Admin and coadmin can manage notices
router.get('/notices', auth, authorize(['admin','coadmin']), getAllNotices);
import { createNotice, updateNotice, deleteNotice } from '../controllers/notice.controller.js';
router.post('/notices', auth, authorize(['admin','coadmin']), createNotice);

// optional: admin/coadmin can also update/delete via admin router if desired
router.put('/notices/:id', auth, authorize(['admin','coadmin']), updateNotice);
router.delete('/notices/:id', auth, authorize(['admin','coadmin']), deleteNotice);

// Admin-only user management
router.get('/users', auth, authorize(['admin']), listUsers);
router.put('/users/:id/role', auth, authorize(['admin']), updateUserRole);

export default router;
