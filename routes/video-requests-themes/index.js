const express = require('express');

const { verifyToken } = require('../../middleware/authJwt');

const {
  addVideoRequestsThemes,
  getAllVideoRequestsThemes,
  getVideoThemeById,
  updateVideoThemes,
  updateVideoRequestIds,
  removeVideoRequestIds,
  deleteVideoRequestTheme,
  changeVideoRequestTheme,
} = require('../../controllers/video-requests-themes');

const app = express.Router();

// const allowedRoles = ['superadmin', 'backend', 'executive-producer'];
app.post('/', verifyToken, addVideoRequestsThemes);
app.post('/change-video-request-theme', verifyToken, changeVideoRequestTheme);

app.get('/:id', verifyToken, getVideoThemeById);
app.get('/', verifyToken, getAllVideoRequestsThemes);

app.put('/:id', verifyToken, updateVideoThemes);
app.put('/update-video-request-ids/:id', verifyToken, updateVideoRequestIds);
app.put('/remove-video-request/:id', verifyToken, removeVideoRequestIds);

app.delete('/:id', verifyToken, deleteVideoRequestTheme);

module.exports = app;
