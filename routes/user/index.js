const express = require('express');

const {
  verifyToken,
  ensureAccess,
  IsAccess,
} = require('../../middleware/authJwt');
const {
  getById,
  allUsers,
  adminBoard,
  updateUser,
  updateStatus,
  updateAllUser,
  deleteUserById,
  createSuperAdmin,
  deletePermanentUserById,
} = require('../../controllers/user/user');

const app = express.Router();

const allowedRoles = [
  'superadmin',
  'backend',
  'executive-producer',
  'producer',
];

const allowRoles = ['superadmin', 'backend', 'executive-producer'];

app.get('/', verifyToken, allUsers);
app.get('/current-user', verifyToken, getById);
app.get('/admin', verifyToken, ensureAccess(allowRoles), adminBoard);
app.get('/:id', verifyToken, ensureAccess(allowedRoles), getById);
app.put('/status/:id', verifyToken, ensureAccess(allowRoles), updateStatus);
app.put('/:id', verifyToken, ensureAccess(allowedRoles), updateUser);
app.delete('/:id', verifyToken, IsAccess(allowRoles), deleteUserById);
app.delete(
  '/permanent-delete-user/:id',
  verifyToken,
  IsAccess(allowRoles),
  deletePermanentUserById
);

// migration
app.post('/updateUserData', updateAllUser);
app.post('/create-superadmin', createSuperAdmin);

module.exports = app;
