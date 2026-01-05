import express from 'express';
const router = express.Router();
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import auth from '../middleware/auth.middleware.js';

router.get('/', getTasks);
router.post('/', auth, createTask);
router.get('/:id', getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;
