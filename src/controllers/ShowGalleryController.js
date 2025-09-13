const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');

// ✅ Create a new gallery image
const createShowGallery = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const url = req.file.path;
    const publicId = req.file.filename;

    const showGallery = await prisma.showGallery.create({
      data: {
        title,
        url,
        publicId,
      },
    });

    res.status(201).json(showGallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all gallery images
const getAllShowGalleries = async (req, res) => {
  try {
    const galleries = await prisma.showGallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get single item by ID
const getShowGalleryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const gallery = await prisma.showGallery.findUnique({ where: { id } });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update gallery item (optionally replace image)
const updateShowGallery = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    const existing = await prisma.showGallery.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const dataToUpdate = { title };

    if (req.file) {
      // Delete old image from Cloudinary if present
      if (existing.publicId) {
        await cloudinary.uploader.destroy(existing.publicId);
      }

      dataToUpdate.url = req.file.path;
      dataToUpdate.publicId = req.file.filename;
    }

    const updated = await prisma.showGallery.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete gallery item and its Cloudinary image
const deleteShowGallery = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.showGallery.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    await prisma.showGallery.delete({ where: { id } });

    res.json({ message: 'Deleted successfully (DB + Cloudinary)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShowGallery,
  getAllShowGalleries,
  getShowGalleryById,
  updateShowGallery,
  deleteShowGallery,
};
