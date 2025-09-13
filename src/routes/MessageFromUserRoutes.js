const express = require("express");
const MessageFromUserRouter = express.Router();

const MessageFromUserController = require("../controllers/MessageFromUserController");

// POST: Submit a new message
MessageFromUserRouter.post(
  "/",
  MessageFromUserController.createMessageFromUser
);

// GET: Get all messages
MessageFromUserRouter.get(
  "/",
  MessageFromUserController.getAllMessages
);

// GET: Get a single message by ID
MessageFromUserRouter.get(
  "/:id",
  MessageFromUserController.getMessageById
);

// DELETE: Delete a message by ID
MessageFromUserRouter.delete(
  "/:id",
  MessageFromUserController.deleteMessage
);

module.exports = MessageFromUserRouter;
