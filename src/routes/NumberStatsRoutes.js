// routes/NumberStatsRoutes.js
const express = require('express');
const NumberStatsRouter = express.Router();
const NumberStatsController = require('../controllers/NumberStatsController');

// Singleton behavior — no ID required
NumberStatsRouter.post('/', NumberStatsController.createNumberStats);
NumberStatsRouter.get('/', NumberStatsController.getAllNumberStats);
NumberStatsRouter.put('/', NumberStatsController.updateNumberStats); // ✅ fixed
NumberStatsRouter.get('/:id', NumberStatsController.getNumberStatsById);
NumberStatsRouter.delete('/:id', NumberStatsController.deleteNumberStats);

module.exports = NumberStatsRouter;
