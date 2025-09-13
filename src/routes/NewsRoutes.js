// routes/NewsRoutes.js

const express = require("express");
const NewsRouter = express.Router();
const NewsController = require("../controllers/NewsController");
const upload = require("../utils/multer"); // adjust the path if needed

// ✅ Create News - with image & PDF upload
NewsRouter.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  NewsController.createNews
);

// ✅ Get all news (latest first)
NewsRouter.get("/", NewsController.getAllNews);

// ✅ Get latest news + 6 recent ones
NewsRouter.get("/latest", NewsController.getLatestNewsWithSix);

// ✅ Get news by ID
NewsRouter.get("/:id", NewsController.getNewsById);

// ✅ Update News (optional new image/pdf)
NewsRouter.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  NewsController.updateNews
);

// ✅ Delete News
NewsRouter.delete("/:id", NewsController.deleteNews);

module.exports = NewsRouter;
