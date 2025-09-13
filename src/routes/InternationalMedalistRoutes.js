const express = require('express');
const InternationalMedalistRouter = express.Router();
const InternationalMedalistController = require('../controllers/InternationalMedalistController');

InternationalMedalistRouter.post('/', InternationalMedalistController.createInternationalMedalist);
InternationalMedalistRouter.get('/', InternationalMedalistController.getAllInternationalMedalists);
InternationalMedalistRouter.get('/:id', InternationalMedalistController.getInternationalMedalistById);
InternationalMedalistRouter.put('/:id', InternationalMedalistController.updateInternationalMedalist);
InternationalMedalistRouter.delete('/:id', InternationalMedalistController.deleteInternationalMedalist);

module.exports = InternationalMedalistRouter; 