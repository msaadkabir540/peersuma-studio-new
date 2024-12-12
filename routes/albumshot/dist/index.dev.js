"use strict";

var express = require('express');

var _require = require('../../middleware/authJwt'),
    verifyToken = _require.verifyToken,
    ensureAccess = _require.ensureAccess;

var _require2 = require('../../middleware'),
    schemaValidation = _require2.schemaValidation;

var _require3 = require('../../controllers/albumShot'),
    allAlbumShot = _require3.allAlbumShot,
    moveAlbumShot = _require3.moveAlbumShot,
    addAlbumShot = _require3.addAlbumShot,
    uploadShotMedia = _require3.uploadShotMedia,
    updateAlbumShot = _require3.updateAlbumShot,
    deleteAlbumShot = _require3.deleteAlbumShot,
    updateAlbumShotUrl = _require3.updateAlbumShotUrl,
    invitationUserEmail = _require3.invitationUserEmail,
    removeAlbumShotMedia = _require3.removeAlbumShotMedia,
    renameAlbumShotMedia = _require3.renameAlbumShotMedia,
    getAlbumShotByIdOrShotUrl = _require3.getAlbumShotByIdOrShotUrl,
    updateAlbumShotVisibility = _require3.updateAlbumShotVisibility;

var _require4 = require('../../models/AlbumShot'),
    albumshotJoiSchema = _require4.albumshotJoiSchema;

var app = express.Router();
var allowedRoles = ['superadmin', 'backend', 'executive-producer'];
app.get('/', verifyToken, ensureAccess(allowedRoles), allAlbumShot);
app.post('/', verifyToken, ensureAccess(allowedRoles), schemaValidation(albumshotJoiSchema), addAlbumShot);
app.get('/single_shot', getAlbumShotByIdOrShotUrl);
app.put('/upload/:id', uploadShotMedia);
app.put('/shotUrl/:id', verifyToken, ensureAccess(allowedRoles), updateAlbumShotUrl);
app.post('/move-album-shot', moveAlbumShot);
app.post('/invitation', invitationUserEmail);
app["delete"]('/delete-media', removeAlbumShotMedia);
app.put('/update-media-name/:id', renameAlbumShotMedia);
app.put('/updateAlbumShotVisibility/:id', updateAlbumShotVisibility);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), updateAlbumShot);
app["delete"]('/:id', verifyToken, ensureAccess(allowedRoles), deleteAlbumShot);
module.exports = app;