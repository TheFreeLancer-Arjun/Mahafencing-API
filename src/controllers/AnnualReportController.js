const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');

// CREATE
const createAnnualReport = async (req, res) => {
  try {
    const { title, year } = req.body;

    if (!req.file) return res.status(400).json({ error: 'PDF file is required' });

    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'annual-reports' },
      async (error, result) => {
        if (error) return res.status(500).json({ error: 'Cloudinary upload failed' });

        const annualReport = await prisma.annualReport.create({
          data: {
            title,
            year,
            pdfUrl: result.secure_url,
            publicId: result.public_id,
          },
        });

        res.status(201).json(annualReport);
      }
    );

    // Upload file from buffer
    uploadResult.end(req.file.buffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
const getAllAnnualReports = async (req, res) => {
  try {
    const annualReports = await prisma.annualReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(annualReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
const getAnnualReportById = async (req, res) => {
  try {
    const report = await prisma.annualReport.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateAnnualReport = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, year } = req.body;

    const existing = await prisma.annualReport.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    let newPdfUrl = existing.pdfUrl;
    let newPublicId = existing.publicId;

    if (req.file) {
      // Delete old file
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'raw' });

      // Upload new file
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'raw', folder: 'annual-reports' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      newPdfUrl = uploadResult.secure_url;
      newPublicId = uploadResult.public_id;
    }

    const updated = await prisma.annualReport.update({
      where: { id },
      data: { title, year, pdfUrl: newPdfUrl, publicId: newPublicId },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
const deleteAnnualReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.annualReport.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'raw' });

    await prisma.annualReport.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAnnualReport,
  getAllAnnualReports,
  getAnnualReportById,
  updateAnnualReport,
  deleteAnnualReport,
};
