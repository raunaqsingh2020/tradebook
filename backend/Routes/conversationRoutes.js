const express = require("express");
const conversationController = require("../Controllers/conversationController");

const router = express.Router();

router
    .route("/conversations")
    .get(conversationController.getConversations)
router
    .route("/conversation")
    .get(conversationController.getConversation)
    .post(conversationController.postConversation)

module.exports = router;