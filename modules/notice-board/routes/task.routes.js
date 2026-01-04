const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', getTasks);
router.post('/', auth, createTask);
router.get('/:id', getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
