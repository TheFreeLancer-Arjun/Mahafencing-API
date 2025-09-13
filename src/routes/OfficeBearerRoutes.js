const express = require('express');
const OfficeBearerRouter = express.Router();
const officeBearerController = require('../controllers/OfficeBearerController');

OfficeBearerRouter.post('/', officeBearerController.createOfficeBearer);
OfficeBearerRouter.get('/', officeBearerController.getAllOfficeBearers);
OfficeBearerRouter.get('/:id', officeBearerController.getOfficeBearerById);
OfficeBearerRouter.put('/:id', officeBearerController.updateOfficeBearer);
OfficeBearerRouter.delete('/:id', officeBearerController.deleteOfficeBearer);

module.exports = OfficeBearerRouter; 