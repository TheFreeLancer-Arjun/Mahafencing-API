const prisma = require('../db/prisma');

// Default values if no data is passed
const DEFAULT_DATA = {
  ourLocation: `MUKTANGAN", Row-House No.3, Jagatnetra, Plot No.33, Nath Prangan, Behind Emrald City, Shivaji Nagar Road, Aurangabad-431010`,
  phone: 'Primary: +9823389959',
  email: 'mahafencing@gmail.com',
};

// Create entry (use default if body empty)
const createGetInTouch = async (req, res) => {
  try {
    const { ourLocation, phone, email } = req.body;

    const getInTouch = await prisma.getInTouch.create({
      data: {
        ourLocation: ourLocation || DEFAULT_DATA.ourLocation,
        phone: phone || DEFAULT_DATA.phone,
        email: email || DEFAULT_DATA.email,
      },
    });

    res.status(201).json(getInTouch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all records (sorted by newest)
const getAllGetInTouches = async (req, res) => {
  try {
    const getInTouches = await prisma.getInTouch.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(getInTouches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one by ID
const getGetInTouchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const getInTouch = await prisma.getInTouch.findUnique({ where: { id } });

    if (!getInTouch) return res.status(404).json({ error: 'Not found' });

    res.json(getInTouch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update by ID
const updateGetInTouch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const getInTouch = await prisma.getInTouch.update({
      where: { id },
      data: req.body,
    });
    res.json(getInTouch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete by ID
const deleteGetInTouch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.getInTouch.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createGetInTouch,
  getAllGetInTouches,
  getGetInTouchById,
  updateGetInTouch,
  deleteGetInTouch,
};
