"use strict";

var express = require('express');

var _require = require('../../middleware/authJwt'),
    verifyToken = _require.verifyToken,
    ensureAccess = _require.ensureAccess;

var _require2 = require('../../middleware'),
    schemaValidation = _require2.schemaValidation;

var _require3 = require('../../controllers/album'),
    addAlbum = _require3.addAlbum,
    allAlbums = _require3.allAlbums,
    uploadMedia = _require3.uploadMedia,
    updateAlbum = _require3.updateAlbum,
    getAlbumById = _require3.getAlbumById,
    updateAlbumShortLink = _require3.updateAlbumShortLink,
    allAlbumData = _require3.allAlbumData;

var _require4 = require('../../models/Album'),
    albumJoiSchema = _require4.albumJoiSchema;

var app = express.Router();
var allowedRoles = ['superadmin', 'backend', 'executive-producer'];
app.get('/', verifyToken, ensureAccess(allowedRoles), allAlbums);
app.get('/get-all-album', verifyToken, ensureAccess(allowedRoles), allAlbumData);
app.get('/single_album', getAlbumById);
app.put('/upload/:id', uploadMedia);
app.put('/short_link/:id', verifyToken, ensureAccess(allowedRoles), updateAlbumShortLink);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), updateAlbum);
app.post('/', verifyToken, ensureAccess(allowedRoles), schemaValidation(albumJoiSchema), addAlbum);
module.exports = app;