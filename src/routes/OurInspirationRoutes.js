const express = require("express");
const OurInspirationRouter = express.Router();

const ourInspirationController = require("../controllers/OurInspirationController");
const upload = require("../utils/multer"); // import your multer middleware

// ✅ POST with image upload
OurInspirationRouter.post(
  "/",
  upload.single("image"), // This enables file upload handling
  ourInspirationController.createOurInspiration
);

// ✅ GET all
OurInspirationRouter.get("/", ourInspirationController.getAllOurInspirations);

// ✅ GET by ID
OurInspirationRouter.get(
  "/:id",
  ourInspirationController.getOurInspirationById
);

// ✅ PUT with optional image replacement
OurInspirationRouter.put(
  "/:id",
  upload.single("image"), // Needed in case a new image is being uploaded
  ourInspirationController.updateOurInspiration
);

// ✅ DELETE
OurInspirationRouter.delete(
  "/:id",
  ourInspirationController.deleteOurInspiration
);

module.exports = OurInspirationRouter;
