import express from "express";
import { handleChat, getConversations, getConversationMessages, deleteConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", handleChat);
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversationMessages);
router.delete("/conversations/:id", deleteConversation);

export default router;
