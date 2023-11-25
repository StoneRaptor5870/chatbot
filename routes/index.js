// routes/index.js
const express = require('express');
const router = express.Router();

const chatRoutes = require('./chatRoutes');

router.use('/chat', chatRoutes);

module.exports = router;
