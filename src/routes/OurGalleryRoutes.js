const express = require("express");
const OurGalleryRouter = express.Router();

const OurGalleryController = require("../controllers/OurGalleryController");
const upload = require("../utils/multer"); // ✅ make sure this path is correct

// ✅ POST: Upload a gallery image
OurGalleryRouter.post("/", upload.single("image"), OurGalleryController.createOurGallery);

// ✅ GET: Get all gallery items
OurGalleryRouter.get("/", OurGalleryController.getAllOurGalleries);

// ✅ DELETE: Delete by ID
OurGalleryRouter.delete("/:id", OurGalleryController.deleteOurGallery);

module.exports = OurGalleryRouter;
