const Task = require('../models/task');

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
    return buffer.toString('base64');
};

exports.getTasks = (req, res) => {
    const { priority } = req.query;
    let query = 'SELECT * FROM tasks';
    const queryParams = [];

    if (priority) {
        query += ' WHERE priority = ?';
        queryParams.push(priority);
    }

    query += ' ORDER BY added_at ASC';

    Task.query(query, queryParams, (err, results) => {
        if (err) return res.status(500).send(err);

        // Convert image buffers to base64 strings
        const tasksWithImages = results.map(task => {
            if (task.image) {
                task.image = `data:image/jpeg;base64,${bufferToBase64(task.image)}`;
            }
            return task;
        });

        res.json(tasksWithImages);
    });
};

exports.getTaskById = (req, res) => {
    const id = req.params.id;
    Task.getById(id, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) {
            return res.status(404).send({ message: 'Task not found' });
        }
        const task = results[0];
        if (task.image) {
            task.image = `data:image/jpeg;base64,${bufferToBase64(task.image)}`;
           
        }
        res.json(task);
    });
};

exports.createTask = (req, res) => {
    const { heading, description, date, time, priority } = req.body;
    const image = req.file ? req.file.buffer : null; // Store buffer directly
    const data = { heading, description, date, time, priority, image };
    Task.create(data, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId });
    });
};

exports.updateTask = (req, res) => {
    const id = req.params.id;
    const { heading, description, date, time, priority } = req.body;
    const image = req.file ? req.file.buffer : null; // Store buffer directly
    const data = { heading, description, date, time, priority, image };
    Task.update(id, data, (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    });
};

exports.deleteTask = (req, res) => {
    const id = req.params.id;
    Task.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    });
};
