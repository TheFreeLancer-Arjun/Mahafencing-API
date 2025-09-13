const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
// ✅ Create with Cloudinary image upload
const createOurInspiration = async (req, res) => {
  try {
    const { name, designation, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const url = req.file.path;
    const publicId = req.file.filename;

    const ourInspiration = await prisma.ourInspiration.create({
      data: {
        url,
        name,
        designation,
        description,
        publicId,
      },
    });

    res.status(201).json(ourInspiration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all
const getAllOurInspirations = async (req, res) => {
  try {
    const ourInspirations = await prisma.ourInspiration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(ourInspirations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by ID
const getOurInspirationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ourInspiration = await prisma.ourInspiration.findUnique({
      where: { id },
    });

    if (!ourInspiration) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(ourInspiration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update (with optional image replace & delete old)
const updateOurInspiration = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, designation, description } = req.body;

    const existing = await prisma.ourInspiration.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    const dataToUpdate = { name, designation, description };

    if (req.file) {
      // 🗑️ Delete old image
      if (existing.publicId) {
        await cloudinary.uploader.destroy(existing.publicId);
      }

      // 📤 Add new image
      dataToUpdate.url = req.file.path;
      dataToUpdate.publicId = req.file.filename;
    }

    const updated = await prisma.ourInspiration.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete with image removal from Cloudinary
const deleteOurInspiration = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.ourInspiration.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Inspiration not found' });
    }

    // 🗑️ Delete image from Cloudinary
    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    // ❌ Delete record
    await prisma.ourInspiration.delete({
      where: { id },
    });

    res.json({ message: 'Deleted successfully (DB + Cloudinary)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOurInspiration,
  getAllOurInspirations,
  getOurInspirationById,
  updateOurInspiration,
  deleteOurInspiration,
};
