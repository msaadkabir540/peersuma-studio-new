const express = require('express');

const { verifyToken } = require('../../middleware/authJwt');

const {
  addComments,
  addVideoDraft,
  renameDraftVideoName,
  getVideoDraftByClientId,
} = require('../../controllers/draft');

const app = express.Router();

app.post('/', verifyToken, addVideoDraft);
app.put('/add-comments/:id', addComments);
app.put('/update-draft-name/:id', renameDraftVideoName);
app.get('/get-video-draft-clientId/', verifyToken, getVideoDraftByClientId);

module.exports = app;
