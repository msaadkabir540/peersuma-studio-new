const express = require('express');

const { downloadFile, getVideoDuration } = require('../../controllers/utils');

const app = express.Router();

app.get('/download', downloadFile);
app.get('/video-meta', getVideoDuration);

module.exports = app;
