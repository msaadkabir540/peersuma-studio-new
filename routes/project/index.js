const express = require('express');
const {
  add,
  getAll,
  remove,
  update,
  getById,
  deleteFile,
  mergeFinalVideo,
  getTemplateFields,
  downloadFinalVideo,
  renderTemplateVideo,
  updateProjectStatus,
  generateMergeBlockFields,
  updateProcessingStatus,
  updateProjectName,
} = require('../../controllers/projects');
const { verifyToken } = require('../../middleware/authJwt');

const app = express.Router();

app.get('/', verifyToken, getAll);
app.get('/get-fields', getTemplateFields);
app.get('/:id', getById);

app.post('/', add);
app.post('/merge-final-video', mergeFinalVideo);
app.post('/downloadFinalVideo', downloadFinalVideo);
app.post('/renderTemplateVideo', renderTemplateVideo);
app.post('/generateMergeBlockFields', generateMergeBlockFields);

app.put('/updateStatus/:id', updateProjectStatus);
app.put('/update-project-name/:id', updateProjectName);
app.put('/:id', update);

app.patch('/update-processing-status', updateProcessingStatus);

app.delete('/:id', remove);
app.delete('/delete-file', deleteFile);

module.exports = app;
