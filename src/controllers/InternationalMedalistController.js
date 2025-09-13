const prisma = require("../db/prisma");
const cloudinary = require('../utils/cloudinary');
// ✅ Create InternationalMedalist with PDF upload
const createInternationalMedalist = async (req, res) => {
  try {
    const { title, year } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const pdfUrl = req.file.path;

    const internationalMedalist = await prisma.internationalMedalist.create({
      data: {
        title,
        year,
        pdfUrl,
      },
    });

    res.status(201).json(internationalMedalist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all, ordered by latest
const getAllInternationalMedalists = async (_req, res) => {
  try {
    const internationalMedalists = await prisma.internationalMedalist.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(internationalMedalists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by ID
const getInternationalMedalistById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const record = await prisma.internationalMedalist.findUnique({
      where: { id },
    });

    if (!record) return res.status(404).json({ error: "Not found" });

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update (PDF optional — deletes old one if replaced)
const updateInternationalMedalist = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.internationalMedalist.findUnique({
      where: { id },
    });

    if (!existing) return res.status(404).json({ error: "Not found" });

    const { title, year } = req.body;
    const updateData = {
      title: title || existing.title,
      year: year || existing.year,
    };

    if (req.file && req.file.path) {
      // Remove old Cloudinary file
      const publicId = existing.pdfUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`international-medalists/${publicId}`, {
        resource_type: "raw",
      });

      updateData.pdfUrl = req.file.path;
    }

    const updated = await prisma.internationalMedalist.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete + remove PDF from Cloudinary
const deleteInternationalMedalist = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const record = await prisma.internationalMedalist.findUnique({
      where: { id },
    });

    if (!record) return res.status(404).json({ error: "Not found" });

    // Remove PDF from Cloudinary
    const publicId = record.pdfUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`international-medalists/${publicId}`, {
      resource_type: "raw",
    });

    await prisma.internationalMedalist.delete({ where: { id } });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createInternationalMedalist,
  getAllInternationalMedalists,
  getInternationalMedalistById,
  updateInternationalMedalist,
  deleteInternationalMedalist,
};
