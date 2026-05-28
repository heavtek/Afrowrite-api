const express = require('express');
require('dotenv').config();

const pool = require('./db');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Running');
});

app.get('/test-db', async (req, res) => {

    try {

        const result = await pool.query('SELECT NOW()');

        res.json({
            success: true,
            time: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.listen(3000, () => {
    console.log('Server running on port 3000');
});