const prisma = require('../db/prisma');
const cloudinary = require('../utils/cloudinary');
const createShivChhatrapatiAwardee = async (req, res) => {
  try {
    const { name, location, priority } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'shivChhatrapatiAwardees' },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ error: 'Image upload failed' });

        const awardee = await prisma.shivChhatrapatiAwardee.create({
          data: {
            name,
            location,
            priority,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          },
        });

        res.status(201).json(awardee);
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Create error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getAllShivChhatrapatiAwardees = async (req, res) => {
  try {
    const awardees = await prisma.shivChhatrapatiAwardee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(awardees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getShivChhatrapatiAwardeeById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const awardee = await prisma.shivChhatrapatiAwardee.findUnique({ where: { id } });
    if (!awardee) return res.status(404).json({ error: 'Not found' });
    res.json(awardee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateShivChhatrapatiAwardee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, location, priority } = req.body;
    const existing = await prisma.shivChhatrapatiAwardee.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    let imageData = {};
    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(existing.publicId);

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shivChhatrapatiAwardees' },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        );
        stream.end(req.file.buffer);
      });

      imageData = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const updated = await prisma.shivChhatrapatiAwardee.update({
      where: { id },
      data: {
        name,
        location,
        priority,
        ...imageData,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteShivChhatrapatiAwardee = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const awardee = await prisma.shivChhatrapatiAwardee.findUnique({ where: { id } });

    if (!awardee) return res.status(404).json({ error: 'Not found' });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(awardee.publicId);

    await prisma.shivChhatrapatiAwardee.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createShivChhatrapatiAwardee,
  getAllShivChhatrapatiAwardees,
  getShivChhatrapatiAwardeeById,
  updateShivChhatrapatiAwardee,
  deleteShivChhatrapatiAwardee,
};
