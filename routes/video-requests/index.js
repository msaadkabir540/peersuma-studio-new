const express = require('express');

const { verifyToken } = require('../../middleware/authJwt');
const {
  addVideoRequests,
  getAllVideoRequests,
  getVideoRequestById,
  updateVideoRequest,
  deleteVideoRequest,
  addMulipleVideoRequest,
  sendEmailToUserOnVideoRequest,
  sendReminderEmail,
  getAllVideoRequestsByAssignId,
  sendEmailToUser,
} = require('../../controllers/video-requests');

const app = express.Router();

app.get('/', verifyToken, getAllVideoRequests);
app.get('/:id', verifyToken, getVideoRequestById);
app.get('/get-by-assignto/:id', verifyToken, getAllVideoRequestsByAssignId);

app.put('/:id', verifyToken, updateVideoRequest);

app.post('/', verifyToken, addVideoRequests);
app.post('/add-multiple', verifyToken, addMulipleVideoRequest);
app.post('/resign-user', verifyToken, sendEmailToUserOnVideoRequest);
app.post('/reminder-email', verifyToken, sendReminderEmail);
app.post('/send-email-user', verifyToken, sendEmailToUser);

app.delete('/:id', verifyToken, deleteVideoRequest);

module.exports = app;
