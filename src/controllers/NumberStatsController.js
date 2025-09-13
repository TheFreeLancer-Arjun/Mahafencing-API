const prisma = require('../db/prisma');

// 🚀 Initialize default stats if not exists
const initializeNumberStats = async () => {
  const existing = await prisma.numberStats.findFirst();
  if (!existing) {
    await prisma.numberStats.create({
      data: {
        registeredPlayers: '15000+',
        shivChhatrapatiAwardees: '53',
        nationalMedalists: '8',
        internationalMedalists: '9',
      },
    });
  }
};

// ✅ Create (only if none exists)
const createNumberStats = async (req, res) => {
  try {
    const existing = await prisma.numberStats.findFirst();
    if (existing) {
      return res.status(400).json({ error: 'Stats already exist. Use update instead.' });
    }

    const stat = await prisma.numberStats.create({ data: req.body });
    res.status(201).json(stat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all stats (even though we expect only one)
const getAllNumberStats = async (req, res) => {
  try {
    await initializeNumberStats();
    const stats = await prisma.numberStats.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by ID
const getNumberStatsById = async (req, res) => {
  try {
    const stat = await prisma.numberStats.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!stat) return res.status(404).json({ error: 'Stat not found' });
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update by ID (or default entry if singleton)
const updateNumberStats = async (req, res) => {
  try {
    const existing = await prisma.numberStats.findFirst();
    if (!existing) {
      return res.status(404).json({ error: 'No stats found to update' });
    }

    const {
      registeredPlayers,
      shivChhatrapatiAwardees,
      nationalMedalists,
      internationalMedalists,
    } = req.body;

    const updated = await prisma.numberStats.update({
      where: { id: existing.id },
      data: {
        registeredPlayers,
        shivChhatrapatiAwardees,
        nationalMedalists,
        internationalMedalists,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete by ID
const deleteNumberStats = async (req, res) => {
  try {
    const deleted = await prisma.numberStats.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNumberStats,
  getAllNumberStats,
  getNumberStatsById,
  updateNumberStats,
  deleteNumberStats,
};
