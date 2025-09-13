const prisma = require('../db/prisma');


// ✅ Create Admin
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const newAdmin = await prisma.admin.create({
      data: { username, password },
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.params.id },
    });

    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const updatedAdmin = await prisma.admin.update({
      where: { id: req.params.id },
      data: { username, password },
    });

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    await prisma.admin.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
