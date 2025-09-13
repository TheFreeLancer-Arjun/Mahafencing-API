const prisma = require('../db/prisma');

// CREATE
const createNISCoach = async (req, res) => {
  try {
    const { name, location, course } = req.body;

    const nisCoach = await prisma.nISCoach.create({
      data: { name, location, course },
    });

    res.status(201).json(nisCoach);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
const getAllNISCoaches = async (req, res) => {
  try {
    const nisCoaches = await prisma.nISCoach.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(nisCoaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE
const getNISCoachById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const nisCoach = await prisma.nISCoach.findUnique({ where: { id } });

    if (!nisCoach) return res.status(404).json({ error: 'Not found' });

    res.json(nisCoach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateNISCoach = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.nISCoach.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { name, location, course } = req.body;

    const updated = await prisma.nISCoach.update({
      where: { id },
      data: { name, location, course },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
const deleteNISCoach = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.nISCoach.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await prisma.nISCoach.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNISCoach,
  getAllNISCoaches,
  getNISCoachById,
  updateNISCoach,
  deleteNISCoach,
};
