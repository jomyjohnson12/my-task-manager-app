const express = require('express');
const multer = require('multer');
const path = require('path');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Use memory storage to keep image data in buffer
const upload = multer({ storage: storage });

// Routes
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', upload.single('image'), taskController.createTask);
router.put('/tasks/:id', upload.single('image'), taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
