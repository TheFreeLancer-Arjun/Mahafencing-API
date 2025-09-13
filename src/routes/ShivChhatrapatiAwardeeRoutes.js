const express = require("express");
const ShivChhatrapatiAwardeeRouter = express.Router();
const controller = require("../controllers/shivChhatrapatiAwardeeController");

ShivChhatrapatiAwardeeRouter.post("/", controller.createShivChhatrapatiAwardee);
ShivChhatrapatiAwardeeRouter.get("/", controller.getAllShivChhatrapatiAwardees);
ShivChhatrapatiAwardeeRouter.get("/:id", controller.getShivChhatrapatiAwardeeById);
ShivChhatrapatiAwardeeRouter.put("/:id", controller.updateShivChhatrapatiAwardee);
ShivChhatrapatiAwardeeRouter.delete("/:id", controller.deleteShivChhatrapatiAwardee);

module.exports = ShivChhatrapatiAwardeeRouter;
