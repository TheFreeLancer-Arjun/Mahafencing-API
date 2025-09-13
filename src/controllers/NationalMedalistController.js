const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
// ✅ Create NationalMedalist with PDF upload
const createNationalMedalist = async (req, res) => {
  try {
    const { title, year } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const pdfUrl = req.file.path;

    const nationalMedalist = await prisma.nationalMedalist.create({
      data: {
        title,
        year,
        pdfUrl,
      },
    });

    res.status(201).json(nationalMedalist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all NationalMedalists (latest first)
const getAllNationalMedalists = async (_req, res) => {
  try {
    const nationalMedalists = await prisma.nationalMedalist.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(nationalMedalists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get one by ID
const getNationalMedalistById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const nationalMedalist = await prisma.nationalMedalist.findUnique({ where: { id } });

    if (!nationalMedalist) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(nationalMedalist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update (PDF optional, old one deleted from Cloudinary if replaced)
const updateNationalMedalist = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.nationalMedalist.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { title, year } = req.body;

    const updateData = {
      title: title || existing.title,
      year: year || existing.year,
    };

    if (req.file && req.file.path) {
      // Optional: delete old PDF from Cloudinary
      const publicId = existing.pdfUrl?.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`national-medalists/${publicId}`, {
          resource_type: 'raw', // raw = for PDF
        });
      }

      updateData.pdfUrl = req.file.path;
    }

    const updated = await prisma.nationalMedalist.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete + remove PDF from Cloudinary
const deleteNationalMedalist = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.nationalMedalist.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    const publicId = existing.pdfUrl?.split('/').pop()?.split('.')[0];

    if (publicId) {
      await cloudinary.uploader.destroy(`national-medalists/${publicId}`, {
        resource_type: 'raw',
      });
    }

    await prisma.nationalMedalist.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNationalMedalist,
  getAllNationalMedalists,
  getNationalMedalistById,
  updateNationalMedalist,
  deleteNationalMedalist,
};
