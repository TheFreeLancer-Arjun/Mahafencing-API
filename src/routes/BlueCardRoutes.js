const express = require("express");
const BlueCardRouter = express.Router();
const BlueCardController = require("../controllers/BlueCardController");

BlueCardRouter.post("/", BlueCardController.createBlueCard);
BlueCardRouter.get("/", BlueCardController.getAllBlueCards);
BlueCardRouter.get("/latest", BlueCardController.getLatestBlueCard); // ✅ new route
BlueCardRouter.put("/:id", BlueCardController.updateBlueCard);
BlueCardRouter.delete("/:id", BlueCardController.deleteBlueCard);

module.exports = BlueCardRouter;
