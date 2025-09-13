const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');

// ✅ Create News (Image + PDF)
const createNews = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files?.image || !req.files?.pdf) {
      return res.status(400).json({ error: 'Image and PDF are required' });
    }

    const imageFile = req.files.image[0];
    const pdfFile = req.files.pdf[0];

    const news = await prisma.news.create({
      data: {
        title,
        description,
        url: imageFile.path,
        pdfUrl: pdfFile.path,
        publicId: `${imageFile.filename},${pdfFile.filename}`,
      },
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All News (latest first)
const getAllNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get News by ID
const getNewsById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Latest News + 6 others
const getLatestNewsWithSix = async (req, res) => {
  try {
    const latest = await prisma.news.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const others = await prisma.news.findMany({
      where: {
        id: { not: latest.id },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    res.json({ latest, others });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update News (text + files if provided)
const updateNews = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'News not found' });

    let newImageUrl = existing.url;
    let newPdfUrl = existing.pdfUrl;
    let newPublicId = existing.publicId;

    if (req.files?.image) {
      const [oldImageId] = existing.publicId.split(',');
      await cloudinary.uploader.destroy(oldImageId);
      const imageFile = req.files.image[0];
      newImageUrl = imageFile.path;
      newPublicId = `${imageFile.filename},${newPublicId.split(',')[1]}`;
    }

    if (req.files?.pdf) {
      const [, oldPdfId] = existing.publicId.split(',');
      await cloudinary.uploader.destroy(oldPdfId);
      const pdfFile = req.files.pdf[0];
      newPdfUrl = pdfFile.path;
      newPublicId = `${newPublicId.split(',')[0]},${pdfFile.filename}`;
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title,
        description,
        url: newImageUrl,
        pdfUrl: newPdfUrl,
        publicId: newPublicId,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete News and remove files
const deleteNews = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'News not found' });

    const [imageId, pdfId] = existing.publicId.split(',');
    await cloudinary.uploader.destroy(imageId);
    await cloudinary.uploader.destroy(pdfId);

    await prisma.news.delete({ where: { id } });

    res.json({ message: 'News and associated files deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,          // ✅ Added
  getLatestNewsWithSix,
  updateNews,
  deleteNews,
};
