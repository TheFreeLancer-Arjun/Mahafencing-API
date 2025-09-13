const express = require("express");
const BannerImageRouter = express.Router();

const BannerImageController = require("../controllers/BannerImageController");
const upload = require("../utils/multer"); // ✅ Import your multer config

// 🛠️ Apply multer middleware to handle image upload
BannerImageRouter.post(
  "/",
  upload.single("image"), // Field name must match frontend FormData key
  BannerImageController.createBannerImage
);

BannerImageRouter.get("/", BannerImageController.getAllBannerImages);
BannerImageRouter.get("/:id", BannerImageController.getBannerImageById);
BannerImageRouter.put("/:id", BannerImageController.updateBannerImage);
BannerImageRouter.delete("/:id", BannerImageController.deleteBannerImage);

module.exports = BannerImageRouter;
