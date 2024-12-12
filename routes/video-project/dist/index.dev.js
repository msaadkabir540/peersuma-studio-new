"use strict";

var express = require('express');

var _require = require('../../middleware/authJwt'),
    verifyToken = _require.verifyToken;

var _require2 = require('../../controllers/video-project'),
    inviteUser = _require2.inviteUser,
    temporaryDelete = _require2.temporaryDelete,
    addVideoProject = _require2.addVideoProject,
    getAllVideoProject = _require2.getAllVideoProject,
    updateVideoProject = _require2.updateVideoProject,
    getVideoProjectById = _require2.getVideoProjectById,
    updateVideoProjectStatus = _require2.updateVideoProjectStatus,
    getVideoProjectByClientId = _require2.getVideoProjectByClientId;

var app = express.Router();
app.post('/user-invitation', inviteUser);
app.post('/', verifyToken, addVideoProject);
app.get('/getall-video-project', verifyToken, getAllVideoProject);
app.get('/get-video-project/:id', verifyToken, getVideoProjectById);
app.get('/get-video-project-clientId/:id', verifyToken, getVideoProjectByClientId);
app.put('/update-video-project/:id', verifyToken, updateVideoProject);
app.put('/update-video-project-status/:id', verifyToken, updateVideoProjectStatus);
app.get('/getall-video-project', verifyToken, getAllVideoProject);
app["delete"]('/temporary-delete/:id', verifyToken, temporaryDelete);
module.exports = app;