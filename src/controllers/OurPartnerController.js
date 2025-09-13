const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
// Create Partner with image
const createOurPartner = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const url = req.file.path;
    const publicId = req.file.filename;

    const ourPartner = await prisma.ourPartner.create({
      data: {
        url,
        title,
        publicId,
      },
    });

    res.status(201).json(ourPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Partners
const getAllOurPartners = async (req, res) => {
  try {
    const ourPartners = await prisma.ourPartner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(ourPartners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Partner
const getOurPartnerById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ourPartner = await prisma.ourPartner.findUnique({ where: { id } });

    if (!ourPartner) return res.status(404).json({ error: 'Not found' });

    res.json(ourPartner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Partner (image optional)
const updateOurPartner = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    const existing = await prisma.ourPartner.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const dataToUpdate = { title };

    if (req.file) {
      if (existing.publicId) {
        await cloudinary.uploader.destroy(existing.publicId);
      }

      dataToUpdate.url = req.file.path;
      dataToUpdate.publicId = req.file.filename;
    }

    const updated = await prisma.ourPartner.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Partner (and image)
const deleteOurPartner = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.ourPartner.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    await prisma.ourPartner.delete({ where: { id } });

    res.json({ message: 'Deleted successfully (DB + Cloudinary)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOurPartner,
  getAllOurPartners,
  getOurPartnerById,
  updateOurPartner,
  deleteOurPartner,
};
