const express = require('express');
const {
  remove,
  update,
  shiftDown,
  mediaReOrder,
} = require('../../controllers/library-widget');

const app = express.Router();

app.put('/:id', update);
app.put('/shift-down/:id', shiftDown);
app.delete('/remove-media', remove);
app.put('/reorderingMedia/:id', mediaReOrder);

module.exports = app;
