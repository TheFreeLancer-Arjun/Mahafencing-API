const express = require('express');
const ResearchRouter = express.Router();
const researchController = require('../controllers/researchController'); // Adjust the path if needed

// Create a new research entry
ResearchRouter.post('/', researchController.createResearch);

// Get all research entries
ResearchRouter.get('/', researchController.getAllResearches);

// Get a single research entry by ID
ResearchRouter.get('/:id', researchController.getResearchById);

// Update a research entry by ID
ResearchRouter.put('/:id', researchController.updateResearch);

// Delete a research entry by ID
ResearchRouter.delete('/:id', researchController.deleteResearch);

module.exports = ResearchRouter;
