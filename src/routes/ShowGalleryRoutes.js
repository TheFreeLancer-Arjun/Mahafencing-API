const express = require("express");
const ShowGalleryRouter = express.Router();

const upload = require("../utils/multer"); // ✅ Multer config with Cloudinary
const controller = require("../controllers/ShowGalleryController");

// ✅ POST: Upload image
ShowGalleryRouter.post("/", upload.single("image"), controller.createShowGallery);

// ✅ GET: All items
ShowGalleryRouter.get("/", controller.getAllShowGalleries);

// ✅ GET: One by ID
ShowGalleryRouter.get("/:id", controller.getShowGalleryById);

// ✅ PUT: Update (optional image)
ShowGalleryRouter.put("/:id", upload.single("image"), controller.updateShowGallery);

// ✅ DELETE: Remove image + DB item
ShowGalleryRouter.delete("/:id", controller.deleteShowGallery);

module.exports = ShowGalleryRouter;
