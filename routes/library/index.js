const express = require('express');
const {
  add,
  getAll,
  remove,
  update,
  getById,
  addMany,
  updateShortLink,
  unlistedViemoVideo,
  getSingleViemoVideo,
  updateThumbnailFromFrame,
  checkAndUpdateReplaceVideo,
  UpdateBgAndTextColorSingleVideo,
  downloadLibraryVideo,
  deleteVimeoVideoByAssetsId,
  updateThumbnailOnReplaceVideoFromViemo,
  updateThumbnailOnReplaceVideoFromVimeo,
} = require('../../controllers/library');

const { verifyToken, IsAccess } = require('../../middleware/authJwt');

const app = express.Router();

const allowedRoles = ['superadmin', 'backend', 'executive-producer'];

app.post('/', verifyToken, add);
app.post('/multi', verifyToken, addMany);

app.get('/single_library', getById);
app.get('/download-library-video', downloadLibraryVideo);
app.get('/get-viemo-video', getSingleViemoVideo);
app.get('/', verifyToken, IsAccess(allowedRoles), getAll);

app.patch('/unlisted-viemo-video', unlistedViemoVideo);

app.put('/:id', verifyToken, update);
app.put('/short_link/:id', verifyToken, updateShortLink);

app.patch('/update_thumbnail', verifyToken, updateThumbnailFromFrame);
app.patch(
  '/update_thumbnail_vimeo',
  verifyToken,
  updateThumbnailOnReplaceVideoFromVimeo
);
app.patch('/update-color', verifyToken, UpdateBgAndTextColorSingleVideo);
app.patch('/update-replace-video', verifyToken, checkAndUpdateReplaceVideo);

app.delete('/delete-vimeo-video', verifyToken, deleteVimeoVideoByAssetsId);
app.delete('/:id', verifyToken, remove);

module.exports = app;
