const prisma = require('../db/prisma');

// ✅ Create Mahafencing
const createMahafencing = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const mahafencing = await prisma.mahafencing.create({
      data: { description },
    });

    res.status(201).json(mahafencing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Mahafencing Entries
const getAllMahafencings = async (req, res) => {
  try {
    const mahafencings = await prisma.mahafencing.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(mahafencings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Latest Mahafencing Entry
const getLatestMahafencing = async (req, res) => {
  try {
    const latest = await prisma.mahafencing.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      return res.status(404).json({ error: 'No Mahafencing entry found' });
    }

    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Mahafencing
const updateMahafencing = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const updated = await prisma.mahafencing.update({
      where: { id },
      data: { description },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Mahafencing
const deleteMahafencing = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.mahafencing.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMahafencing,
  getAllMahafencings,
  getLatestMahafencing,
  updateMahafencing,
  deleteMahafencing,
};
