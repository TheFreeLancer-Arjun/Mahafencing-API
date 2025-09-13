const express = require('express');
const AdminRouter = express.Router();
const AdminController = require('../controllers/AdminController');

AdminRouter.post('/', AdminController.createAdmin);
AdminRouter.get('/', AdminController.getAllAdmins);
AdminRouter.get('/:id', AdminController.getAdminById);
AdminRouter.put('/:id', AdminController.updateAdmin);
AdminRouter.delete('/:id', AdminController.deleteAdmin);

module.exports = AdminRouter; 