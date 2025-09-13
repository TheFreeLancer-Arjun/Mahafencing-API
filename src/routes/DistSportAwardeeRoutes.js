const express = require("express");
const DistSportAwardeeRouter = express.Router();
const DistSportAwardeeController = require("../controllers/DistSportAwardeeController");

DistSportAwardeeRouter.post("/", DistSportAwardeeController.createDistSportAwardee);
DistSportAwardeeRouter.get("/", DistSportAwardeeController.getAllDistSportAwardees);
DistSportAwardeeRouter.get("/:id", DistSportAwardeeController.getDistSportAwardeeById);
DistSportAwardeeRouter.put("/:id", DistSportAwardeeController.updateDistSportAwardee);
DistSportAwardeeRouter.delete("/:id", DistSportAwardeeController.deleteDistSportAwardee);

module.exports = DistSportAwardeeRouter;
