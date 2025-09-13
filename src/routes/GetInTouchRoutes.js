const express = require("express");
const GetInTouchRouter = express.Router();
const GetInTouchController = require("../controllers/GetInTouchController");



// Create a new GetInTouch entry
GetInTouchRouter.post("/", GetInTouchController.createGetInTouch);

// Get all GetInTouch entries
GetInTouchRouter.get("/", GetInTouchController.getAllGetInTouches);

// Get one by ID
GetInTouchRouter.get("/:id", GetInTouchController.getGetInTouchById);

// Update by ID
GetInTouchRouter.put("/:id", GetInTouchController.updateGetInTouch);

// Delete by ID
GetInTouchRouter.delete("/:id", GetInTouchController.deleteGetInTouch);

module.exports = GetInTouchRouter;
