const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
// CREATE
const createOfficeBearer = async (req, res) => {
  try {
    const { name, designation, priority } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const officeBearer = await prisma.officeBearer.create({
      data: {
        name,
        designation,
        priority,
        url: req.file.path,
        publicId: req.file.filename,
      },
    });

    res.status(201).json(officeBearer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
const getAllOfficeBearers = async (req, res) => {
  try {
    const officeBearers = await prisma.officeBearer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(officeBearers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE
const getOfficeBearerById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const officeBearer = await prisma.officeBearer.findUnique({ where: { id } });

    if (!officeBearer) return res.status(404).json({ error: 'Not found' });

    res.json(officeBearer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (optional image)
const updateOfficeBearer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.officeBearer.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    let updateData = {
      name: req.body.name || existing.name,
      designation: req.body.designation || existing.designation,
      priority: req.body.priority || existing.priority,
    };

    // Replace image if a new one is uploaded
    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(existing.publicId);

      updateData.url = req.file.path;
      updateData.publicId = req.file.filename;
    }

    const updated = await prisma.officeBearer.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE (with Cloudinary image delete)
const deleteOfficeBearer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.officeBearer.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(existing.publicId);

    await prisma.officeBearer.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOfficeBearer,
  getAllOfficeBearers,
  getOfficeBearerById,
  updateOfficeBearer,
  deleteOfficeBearer,
};
