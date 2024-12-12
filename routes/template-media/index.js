const express = require('express');

const {
  getAll,
  createMedia,
  deleteTemplateMedia,
  updateTemplateMedia,
  updateTemplateUploadFile,
  getAllTypesAndCategories,
  getTemplateMediaById,
} = require('../../controllers/template-media');

const app = express.Router();

app.get('/', getAll);
app.get('/get-media-library/:id', getTemplateMediaById);
app.get('/getAllTypesAndCategories', getAllTypesAndCategories);
app.post('/', createMedia);
app.put('/', updateTemplateMedia);
app.put('/uploadMediaFile', updateTemplateUploadFile);
app.delete('/', deleteTemplateMedia);

module.exports = app;
