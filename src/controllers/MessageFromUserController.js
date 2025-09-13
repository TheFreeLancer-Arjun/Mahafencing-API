const prisma = require('../db/prisma');

// Create a new message
const createMessageFromUser = async (req, res) => {
  try {
    const { name, email, number, description } = req.body;

    if (!name || !email || !number || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = await prisma.messageFromUser.create({
      data: { name, email, number, description },
    });

    res.status(201).json({
      message: "Message submitted successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
};

// Get all messages (latest first)
const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.messageFromUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get message by ID
const getMessageById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const message = await prisma.messageFromUser.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
};

// Delete message by ID
const deleteMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.messageFromUser.delete({
      where: { id },
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

module.exports = {
  createMessageFromUser,
  getAllMessages,
  getMessageById,
  deleteMessage,
};
