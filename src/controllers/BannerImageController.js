const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');

// 📤 Create Banner Image
const createBannerImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bannerImage = await prisma.bannerImage.create({
      data: {
        url: file.path, // Cloudinary secure_url
        title: req.body.title || file.originalname,
        publicId: file.filename, // This is Cloudinary's public_id
      },
    });

    res.status(201).json(bannerImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📥 Get All Banner Images
const getAllBannerImages = async (req, res) => {
  try {
    const bannerImages = await prisma.bannerImage.findMany();
    res.json(bannerImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get One Banner Image
const getBannerImageById = async (req, res) => {
  try {
    const bannerImage = await prisma.bannerImage.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!bannerImage) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(bannerImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Banner Image Title (optional)
const updateBannerImage = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.bannerImage.update({
      where: { id },
      data: {
        title: req.body.title,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ❌ Delete Banner Image (from DB + Cloudinary)
const deleteBannerImage = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const bannerImage = await prisma.bannerImage.findUnique({ where: { id } });
    if (!bannerImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(bannerImage.publicId);

    // Delete from DB
    await prisma.bannerImage.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBannerImage,
  getAllBannerImages,
  getBannerImageById,
  updateBannerImage,
  deleteBannerImage,
};
