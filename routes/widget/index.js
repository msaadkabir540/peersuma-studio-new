const express = require('express');
const {
  add,
  getAll,
  remove,
  getById,
  update,
  widgetEmailSend,
} = require('../../controllers/widget');
const { IsAccess, verifyToken } = require('../../middleware/authJwt');

const app = express.Router();

const allowRoles = ['superadmin', 'backend', 'executive-producer'];

app.post('/', add);
app.get('/', verifyToken, IsAccess(allowRoles), getAll);
app.put('/:id', update);
app.get('/:id', getById);
app.get('/view/:id', getById);
app.delete('/:id', remove);
app.delete('/:id', remove);
app.post('/widgetEmailSendToClient', widgetEmailSend);

module.exports = app;
