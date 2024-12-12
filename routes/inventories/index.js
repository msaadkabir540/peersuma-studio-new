const express = require('express');
const {
  addInventory,
  getInventyById,
  getAllInventory,
  updateInventory,
  deleteInventory,
} = require('../../controllers/inventories');
const { IsAccess, verifyToken } = require('../../middleware/authJwt');

const app = express.Router();

// const allowedRoles = ['superadmin', 'backend', 'executive-producer'];

app.post('/', addInventory);
app.get('/', verifyToken, getAllInventory);
app.put('/:id', updateInventory);
app.get('/:id', getInventyById);
app.delete('/:id', deleteInventory);

module.exports = app;
