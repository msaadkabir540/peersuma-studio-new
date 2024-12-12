const express = require('express');
const {
  add,
  getAll,
  remove,
  deleteFile,
  getById,
  update,
} = require('../../controllers/templates/index');

const app = express.Router();

app.post('/', add);
app.get('/', getAll);
app.delete('/delete-file', deleteFile);
app.put('/:id', update);
app.get('/:id', getById);
app.delete('/:id', remove);

module.exports = app;
