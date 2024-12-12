'use strict';

var express = require('express');

var _require = require('../../middleware/authJwt'),
  verifyToken = _require.verifyToken;

var _require2 = require('../../controllers/video-requests-themes'),
  addVideoRequestsThemes = _require2.addVideoRequestsThemes,
  getAllVideoRequestsThemes = _require2.getAllVideoRequestsThemes,
  getVideoThemeById = _require2.getVideoThemeById,
  updateVideoThemes = _require2.updateVideoThemes,
  updateVideoRequestIds = _require2.updateVideoRequestIds,
  removeVideoRequestIds = _require2.removeVideoRequestIds,
  deleteVideoRequestTheme = _require2.deleteVideoRequestTheme,
  changeVideoRequestTheme = _require2.changeVideoRequestTheme;

var app = express.Router(); // const allowedRoles = ['superadmin', 'backend', 'executive-producer'];

app.post('/', verifyToken, addVideoRequestsThemes);
app.post('/change-video-request-theme', verifyToken, changeVideoRequestTheme);
app.get('/:id', verifyToken, getVideoThemeById);
app.get('/', verifyToken, getAllVideoRequestsThemes);
app.put('/:id', verifyToken, updateVideoThemes);
app.put('/update-video-request-ids/:id', verifyToken, updateVideoRequestIds);
app.put('/remove-video-request/:id', verifyToken, removeVideoRequestIds);
app['delete']('/:id', verifyToken, deleteVideoRequestTheme);
module.exports = app;
