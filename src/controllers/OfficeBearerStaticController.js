const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
// ✅ Create new entry with image
const createOfficeBearerStatic = async (req, res) => {
  try {
    const { name, designation, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const url = req.file.path;
    const publicId = req.file.filename;

    const created = await prisma.officeBearerStatic.create({
      data: {
        url,
        publicId,
        name,
        designation,
        description,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all
const getAllOfficeBearerStatics = async (req, res) => {
  try {
    const all = await prisma.officeBearerStatic.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by ID
const getOfficeBearerStaticById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const found = await prisma.officeBearerStatic.findUnique({
      where: { id },
    });

    if (!found) return res.status(404).json({ error: 'Not found' });

    res.json(found);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update with optional image replace
const updateOfficeBearerStatic = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, designation, description } = req.body;

    const existing = await prisma.officeBearerStatic.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const updateData = { name, designation, description };

    if (req.file) {
      // 🗑️ Delete old image
      if (existing.publicId) {
        await cloudinary.uploader.destroy(existing.publicId);
      }

      updateData.url = req.file.path;
      updateData.publicId = req.file.filename;
    }

    const updated = await prisma.officeBearerStatic.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete with Cloudinary image deletion
const deleteOfficeBearerStatic = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.officeBearerStatic.findUnique({
      where: { id },
    });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    // 🗑️ Delete Cloudinary image
    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    // 🗑️ Delete DB record
    await prisma.officeBearerStatic.delete({ where: { id } });

    res.json({ message: 'Deleted successfully (DB + Cloudinary)' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOfficeBearerStatic,
  getAllOfficeBearerStatics,
  getOfficeBearerStaticById,
  updateOfficeBearerStatic,
  deleteOfficeBearerStatic,
};
