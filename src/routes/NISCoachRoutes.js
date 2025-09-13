const express = require("express");
const NISCoachRouter = express.Router();
const NISCoachController = require("../controllers/NISCoachController");

NISCoachRouter.post("/", NISCoachController.createNISCoach);
NISCoachRouter.get("/", NISCoachController.getAllNISCoaches);
NISCoachRouter.get("/:id", NISCoachController.getNISCoachById);
NISCoachRouter.put("/:id", NISCoachController.updateNISCoach);
NISCoachRouter.delete("/:id", NISCoachController.deleteNISCoach);

module.exports = NISCoachRouter;
