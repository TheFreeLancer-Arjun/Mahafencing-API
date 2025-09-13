const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
const createDistSportAwardee = async (req, res) => {
  try {
    const { name, location, priority } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Image or PDF file is required.' });
    }

    const { path, filename } = req.file;

    const awardee = await prisma.distSportAwardee.create({
      data: {
        name,
        location,
        priority,
        url: path,
        publicId: filename,
      },
    });

    res.status(201).json(awardee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDistSportAwardees = async (_req, res) => {
  try {
    const awardees = await prisma.distSportAwardee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(awardees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDistSportAwardeeById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const awardee = await prisma.distSportAwardee.findUnique({ where: { id } });

    if (!awardee) return res.status(404).json({ error: 'Not found' });

    res.json(awardee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDistSportAwardee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.distSportAwardee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { name, location, priority } = req.body;

    let updatedData = {
      name: name || existing.name,
      location: location || existing.location,
      priority: priority || existing.priority,
    };

    if (req.file && req.file.path) {
      // Delete old image/pdf from Cloudinary
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'auto' });

      updatedData.url = req.file.path;
      updatedData.publicId = req.file.filename;
    }

    const updated = await prisma.distSportAwardee.update({
      where: { id },
      data: updatedData,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDistSportAwardee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.distSportAwardee.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'auto' });
    await prisma.distSportAwardee.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDistSportAwardee,
  getAllDistSportAwardees,
  getDistSportAwardeeById,
  updateDistSportAwardee,
  deleteDistSportAwardee,
};
