const express = require("express");
const NationalMedalistRouter = express.Router();
const NationalMedalistController = require("../controllers/NationalMedalistController");

NationalMedalistRouter.post(
  "/",
  NationalMedalistController.createNationalMedalist
);
NationalMedalistRouter.get(
  "/",
  NationalMedalistController.getAllNationalMedalists
);
NationalMedalistRouter.get(
  "/:id",
  NationalMedalistController.getNationalMedalistById
);
NationalMedalistRouter.put(
  "/:id",
  NationalMedalistController.updateNationalMedalist
);
NationalMedalistRouter.delete(
  "/:id",
  NationalMedalistController.deleteNationalMedalist
);

module.exports = NationalMedalistRouter;
