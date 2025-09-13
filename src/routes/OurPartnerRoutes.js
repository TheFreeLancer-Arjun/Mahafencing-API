const express = require('express');
const OurPartnerRouter = express.Router();
const ourPartnerController = require('../controllers/OurPartnerController');

OurPartnerRouter.post('/', ourPartnerController.createOurPartner);
OurPartnerRouter.get('/', ourPartnerController.getAllOurPartners);
OurPartnerRouter.get('/:id', ourPartnerController.getOurPartnerById);
OurPartnerRouter.put('/:id', ourPartnerController.updateOurPartner);
OurPartnerRouter.delete('/:id', ourPartnerController.deleteOurPartner);

module.exports = OurPartnerRouter; 