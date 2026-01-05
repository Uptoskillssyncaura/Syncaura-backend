import express from 'express';
const router = express.Router();
import { createNotice, getNotices, getNotice, updateNotice, deleteNotice } from '../controllers/notice.controller.js';
import auth from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

router.get('/', getNotices);
router.post('/', auth, authorize(['admin','coadmin']), createNotice);
router.get('/:id', getNotice);
router.put('/:id', auth, authorize(['admin','coadmin']), updateNotice);
router.delete('/:id', auth, authorize(['admin','coadmin']), deleteNotice);

export default router;
