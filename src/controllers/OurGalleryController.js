const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');

// ✅ CREATE GALLERY ITEM
const createOurGallery = async (req, res) => {
  try {
    const { title, year } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { path: url, filename: publicId } = req.file;

    const ourGallery = await prisma.ourGallery.create({
      data: {
        title,
        year: Number(year),
        imageUrl: url,
        publicId,
      },
    });

    res.status(201).json(ourGallery);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL ITEMS GROUPED BY YEAR
const getAllOurGalleries = async (req, res) => {
  try {
    const allItems = await prisma.ourGallery.findMany({
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });

    const grouped = allItems.reduce((acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE ITEM
const deleteOurGallery = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.ourGallery.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    await prisma.ourGallery.delete({ where: { id } });

    res.json({ message: 'Deleted successfully (DB + Cloudinary)' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOurGallery,
  getAllOurGalleries,
  deleteOurGallery,
};
