const express = require('express');

const { verifyToken } = require('../../middleware/authJwt');

const {
  inviteUser,
  temporaryDelete,
  addVideoProject,
  getAllVideoProject,
  updateVideoProject,
  getVideoProjectById,
  updateVideoProjectStatus,
  getVideoProjectByClientId,
} = require('../../controllers/video-project');

const app = express.Router();

app.post('/user-invitation', inviteUser);
app.post('/', verifyToken, addVideoProject);
app.get('/getall-video-project', verifyToken, getAllVideoProject);
app.get('/get-video-project/:id', verifyToken, getVideoProjectById);
app.get(
  '/get-video-project-clientId/:id',
  verifyToken,
  getVideoProjectByClientId
);
app.put('/update-video-project/:id', verifyToken, updateVideoProject);
app.put(
  '/update-video-project-status/:id',
  verifyToken,
  updateVideoProjectStatus
);
app.get('/getall-video-project', verifyToken, getAllVideoProject);
app.delete('/temporary-delete/:id', verifyToken, temporaryDelete);

module.exports = app;
