require('express-async-errors');
const express = require('express');
const { error } = require('../middleware/error');
const { handleIncomingMessage } = require('../controllers/auth/auth');
const app = express.Router();
const router = express.Router();

app.use('/utils', require('./utils'));
app.use('/project', require('./project'));
app.use('/template', require('./template'));
app.use('/template-media', require('./template-media'));
app.use('/template-media-category', require('./template-media-category'));
app.use('/client', require('./client'));
app.use('/auth', require('./auth'));
app.use('/users', require('./user'));
app.use('/widget', require('./widget'));
app.use('/library', require('./library'));
app.use('/library-widget', require('./library-widget'));
app.use('/albums', require('./album'));
app.use('/albumshot', require('./albumshot'));
app.use('/themes', require('./themes'));
app.use('/video-project', require('./video-project'));
app.use('/video-draft', require('./video-draft'));
app.use('/inventory', require('./inventories'));
app.use('/video-request', require('./video-requests'));
app.use('/video-requests-themes', require('./video-requests-themes'));

//
router.post('/twilio-webhook', handleIncomingMessage);

app.use('*', error);

module.exports = app;
