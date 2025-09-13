const express = require("express");
const MahafencingRouter = express.Router();

const MahafencingController = require("../controllers/MahafencingController");

MahafencingRouter.post("/", MahafencingController.createMahafencing);
MahafencingRouter.get("/", MahafencingController.getAllMahafencings);
MahafencingRouter.get(
  "/latest",
  MahafencingController.getLatestMahafencing
); // latest one only
MahafencingRouter.put(
  "/:id",
  MahafencingController.updateMahafencing
);
MahafencingRouter.delete(
  "/:id",
  MahafencingController.deleteMahafencing
);

module.exports = MahafencingRouter;
