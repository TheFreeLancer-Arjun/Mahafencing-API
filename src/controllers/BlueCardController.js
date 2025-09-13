const prisma = require('../db/prisma');

// ✅ Create Blue Card
const createBlueCard = async (req, res) => {
  try {
    const { title1, title2, title3, title4, title5 } = req.body;

    const blueCard = await prisma.blueCard.create({
      data: { title1, title2, title3, title4, title5 },
    });

    res.status(201).json(blueCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Blue Cards
const getAllBlueCards = async (req, res) => {
  try {
    const blueCards = await prisma.blueCard.findMany();
    res.json(blueCards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Latest Blue Card (most recently created one)
const getLatestBlueCard = async (req, res) => {
  try {
    const latestBlueCard = await prisma.blueCard.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!latestBlueCard) {
      return res.status(404).json({ error: 'No blue cards found' });
    }

    res.json(latestBlueCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Blue Card
const updateBlueCard = async (req, res) => {
  try {
    const { title1, title2, title3, title4, title5 } = req.body;

    const blueCard = await prisma.blueCard.update({
      where: { id: Number(req.params.id) },
      data: { title1, title2, title3, title4, title5 },
    });

    res.json(blueCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Blue Card
const deleteBlueCard = async (req, res) => {
  try {
    await prisma.blueCard.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: 'Blue card deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBlueCard,
  getAllBlueCards,
  getLatestBlueCard, // ✅ used instead of getById
  updateBlueCard,
  deleteBlueCard,
};
