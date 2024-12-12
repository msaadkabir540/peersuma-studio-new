const express = require('express');

const { verifyToken, ensureAccess } = require('../../middleware/authJwt');

const { schemaValidation } = require('../../middleware');
const {
  // remove,
  addAlbum,
  allAlbums,
  uploadMedia,
  updateAlbum,
  getAlbumById,
  updateAlbumShortLink,
  allAlbumData,
} = require('../../controllers/album');
const { albumJoiSchema } = require('../../models/Album');

const app = express.Router();

const allowedRoles = ['superadmin', 'backend', 'executive-producer'];

app.get('/', verifyToken, ensureAccess(allowedRoles), allAlbums);
app.get(
  '/get-all-album',
  verifyToken,
  ensureAccess(allowedRoles),
  allAlbumData
);
app.get('/single_album', getAlbumById);
app.put('/upload/:id', uploadMedia);
app.put(
  '/short_link/:id',
  verifyToken,
  ensureAccess(allowedRoles),
  updateAlbumShortLink
);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), updateAlbum);
app.post(
  '/',
  verifyToken,
  ensureAccess(allowedRoles),
  schemaValidation(albumJoiSchema),
  addAlbum
);
module.exports = app;
