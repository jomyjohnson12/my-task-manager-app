const express = require('express');
const cors = require('cors');
const app = express();
const taskRoutes = require('./routes/taskRoutes');

// Use the CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use your routes
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
