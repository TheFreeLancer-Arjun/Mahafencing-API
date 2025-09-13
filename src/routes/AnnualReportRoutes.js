const express = require("express");
const AnnualReportRouter = express.Router();
const AnnualReportController = require("../controllers/AnnualReportController");

AnnualReportRouter.post("/", AnnualReportController.createAnnualReport);
AnnualReportRouter.get("/", AnnualReportController.getAllAnnualReports);
AnnualReportRouter.get("/:id", AnnualReportController.getAnnualReportById);
AnnualReportRouter.put("/:id", AnnualReportController.updateAnnualReport);
AnnualReportRouter.delete("/:id", AnnualReportController.deleteAnnualReport);

module.exports = AnnualReportRouter;
