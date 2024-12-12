const express = require('express');

const { verifyToken, ensureAccess } = require('../../middleware/authJwt');

const { schemaValidation } = require('../../middleware');
const {
  allAlbumShot,
  moveAlbumShot,
  addAlbumShot,
  uploadShotMedia,
  updateAlbumShot,
  deleteAlbumShot,
  updateAlbumShotUrl,
  invitationUserEmail,
  removeAlbumShotMedia,
  renameAlbumShotMedia,
  getAlbumShotByIdOrShotUrl,
  updateAlbumShotVisibility,
} = require('../../controllers/albumShot');
const { albumshotJoiSchema } = require('../../models/AlbumShot');

const app = express.Router();

const allowedRoles = ['superadmin', 'backend', 'executive-producer'];

app.get('/', verifyToken, ensureAccess(allowedRoles), allAlbumShot);
app.post(
  '/',
  verifyToken,
  ensureAccess(allowedRoles),
  schemaValidation(albumshotJoiSchema),
  addAlbumShot
);
app.get('/single_shot', getAlbumShotByIdOrShotUrl);
app.put('/upload/:id', uploadShotMedia);
app.put(
  '/shotUrl/:id',
  verifyToken,
  ensureAccess(allowedRoles),
  updateAlbumShotUrl
);
app.post('/move-album-shot', moveAlbumShot);
app.post('/invitation', invitationUserEmail);
app.delete('/delete-media', removeAlbumShotMedia);
app.put('/update-media-name/:id', renameAlbumShotMedia);
app.put('/updateAlbumShotVisibility/:id', updateAlbumShotVisibility);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), updateAlbumShot);
app.delete('/:id', verifyToken, ensureAccess(allowedRoles), deleteAlbumShot);

module.exports = app;
