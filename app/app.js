const express = require('express');

require('../middleware/logger')();

const app = express.Router();

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.use('/', require('../routes'));

module.exports = app;
