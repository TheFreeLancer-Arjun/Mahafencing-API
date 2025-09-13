const express = require("express");
const OfficeBearerStaticRouter = express.Router();

const OfficeBearerStaticController = require("../controllers/OfficeBearerStaticController");
const upload = require("../utils/multer"); // import multer middleware

// ✅ POST with image upload
OfficeBearerStaticRouter.post(
  "/",
  upload.single("image"), // handle single image upload
  OfficeBearerStaticController.createOfficeBearerStatic
);

// ✅ GET all
OfficeBearerStaticRouter.get(
  "/",
  OfficeBearerStaticController.getAllOfficeBearerStatics
);

// ✅ GET by ID
OfficeBearerStaticRouter.get(
  "/:id",
  OfficeBearerStaticController.getOfficeBearerStaticById
);

// ✅ PUT with optional image replacement
OfficeBearerStaticRouter.put(
  "/:id",
  upload.single("image"), // allow replacing image
  OfficeBearerStaticController.updateOfficeBearerStatic
);

// ✅ DELETE
OfficeBearerStaticRouter.delete(
  "/:id",
  OfficeBearerStaticController.deleteOfficeBearerStatic
);

module.exports = OfficeBearerStaticRouter;
