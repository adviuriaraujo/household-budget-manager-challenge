const express = require('express');
const router = require('./routes');

const app = express();
router(app);

module.exports = app;
