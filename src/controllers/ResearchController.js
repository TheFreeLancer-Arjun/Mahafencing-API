const prisma = require('../db/prisma');

// ✅ Create Research
const createResearch = async (req, res) => {
  try {
    const { name, degree, university, year } = req.body;

    if (!name || !degree || !university || !year) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const research = await prisma.research.create({
      data: { name, degree, university, year },
    });

    res.status(201).json(research);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Research Entries
const getAllResearches = async (_req, res) => {
  try {
    const researches = await prisma.research.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(researches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by ID
const getResearchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const research = await prisma.research.findUnique({ where: { id } });

    if (!research) return res.status(404).json({ error: 'Not found' });

    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Research
const updateResearch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.research.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { name, degree, university, year } = req.body;

    const updated = await prisma.research.update({
      where: { id },
      data: {
        name: name || existing.name,
        degree: degree || existing.degree,
        university: university || existing.university,
        year: year || existing.year,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Research
const deleteResearch = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.research.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await prisma.research.delete({ where: { id } });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createResearch,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch,
};
