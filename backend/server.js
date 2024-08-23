const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const { protect, authorize } = require('./middleware/authMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/policies', require('./routes/policy'));
app.use('/api/roles', require('./routes/role'));
app.use('/api/logs', require('./routes/log'));
app.use('/api/project', protect, authorize('manager'), require('./routes/projectRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
