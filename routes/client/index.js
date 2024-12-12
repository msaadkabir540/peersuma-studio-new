const express = require('express');

const {
  add,
  getAll,
  remove,
  getById,
  update,
  updateStatus,
  getByClientId,
  getAllClientNameId,
} = require('../../controllers/client');

const { verifyToken, ensureAccess } = require('../../middleware/authJwt');

const app = express.Router();

const allowedRoles = [
  'backend',
  'producer',
  'superadmin',
  'executive-producer',
  'producer',
];

app.post('/', verifyToken, ensureAccess(allowedRoles), add);
app.get('/', verifyToken, ensureAccess(allowedRoles), getAll);
app.get('/get-all-client', getAllClientNameId);
app.get('/:id', verifyToken, ensureAccess(allowedRoles), getById);
app.get(
  '/clientId/:clientId',
  verifyToken,
  ensureAccess(allowedRoles),
  getByClientId
);
app.put('/status/:id', verifyToken, ensureAccess(allowedRoles), updateStatus);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), update);
app.delete('/:id', verifyToken, ensureAccess(allowedRoles), remove);

module.exports = app;
