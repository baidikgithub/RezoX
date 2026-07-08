import express from "express";
import { handleChat, getConversations, getConversationMessages, deleteConversation } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(optionalAuth);
router.post("/", handleChat);
router.get("/conversations", getConversations);
router.get("/conversations/:id", getConversationMessages);
router.delete("/conversations/:id", deleteConversation);

export default router;
