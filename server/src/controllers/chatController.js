import { routeRequest } from "../services/llmRouter.js";
import { performance } from "perf_hooks";
import { pool } from "../config/db.js";
import { randomUUID } from "crypto";

export async function handleChat(req, res) {
  const { model, message, conversationId } = req.body;

  // Input validation
  if (!model) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameter: model",
    });
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid parameter: message (must be a non-empty string)",
    });
  }

  const normalizedModel = String(model).trim().toLowerCase();
  const validModels = ["gemini", "groq", "cohere", "mistral", "openrouter"];

  if (!validModels.includes(normalizedModel)) {
    return res.status(400).json({
      success: false,
      error: `Invalid model: "${model}". Supported models are: ${validModels.join(", ")}`,
    });
  }

  const startTime = performance.now();
  let activeConversationId = conversationId;
  const userId = req.auth?.id || null;

  try {
    // 1. Resolve or create conversation
    let isNewConversation = false;
    if (activeConversationId) {
      const convCheck = await pool.query(
        "SELECT id FROM conversations WHERE id = $1 AND (user_id IS NULL OR user_id = $2)",
        [activeConversationId, userId]
      );
      if (convCheck.rows.length === 0) {
        isNewConversation = true;
      }
    } else {
      activeConversationId = randomUUID();
      isNewConversation = true;
    }

    if (isNewConversation) {
      const title = message.trim().substring(0, 50) + (message.length > 50 ? "..." : "");
      await pool.query(
        `INSERT INTO conversations (id, user_id, title, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [activeConversationId, userId, title]
      );
    }

    // 2. Save the user's message
    const userMessageId = randomUUID();
    await pool.query(
      `INSERT INTO messages (id, conversation_id, role, content, model, created_at)
       VALUES ($1, $2, 'user', $3, $4, NOW())`,
      [userMessageId, activeConversationId, message.trim(), normalizedModel]
    );

    // 3. Fetch past messages for context (last 30 messages)
    const historyRes = await pool.query(
      `SELECT role, content FROM (
         SELECT role, content, created_at FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at DESC
         LIMIT 30
       ) sub
       ORDER BY created_at ASC`,
      [activeConversationId]
    );

    // Prepare message context payload (prepend system prompt)
    const contextMessages = [
      { role: "system", content: "You are RezoX AI Assistant." },
      ...historyRes.rows
    ];

    // 4. Request response from LLM Router
    const response = await routeRequest(normalizedModel, contextMessages);

    // 5. Save the assistant's response
    const assistantMessageId = randomUUID();
    await pool.query(
      `INSERT INTO messages (id, conversation_id, role, content, model, created_at)
       VALUES ($1, $2, 'assistant', $3, $4, NOW())`,
      [assistantMessageId, activeConversationId, response, normalizedModel]
    );

    // 6. Update conversation timestamp
    await pool.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [activeConversationId]
    );

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    return res.status(200).json({
      success: true,
      conversationId: activeConversationId,
      model: normalizedModel,
      response,
      latency,
    });
  } catch (error) {
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    console.error(`Error processing LLM request for model ${model}:`, error);

    return res.status(500).json({
      success: false,
      model: normalizedModel,
      error: error.message || "Failed to generate response from LLM provider",
      latency,
    });
  }
}

export async function getConversations(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, title, created_at as "createdAt", updated_at as "updatedAt"
       FROM conversations
       WHERE user_id IS NULL OR user_id = $1
       ORDER BY updated_at DESC`,
      [req.auth?.id || null]
    );
    return res.status(200).json({
      success: true,
      conversations: result.rows
    });
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch conversations"
    });
  }
}

export async function getConversationMessages(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.id, m.role, m.content, m.model, m.created_at as "createdAt"
       FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE m.conversation_id = $1 AND (c.user_id IS NULL OR c.user_id = $2)
       ORDER BY m.created_at ASC`,
      [id, req.auth?.id || null]
    );
    return res.status(200).json({
      success: true,
      messages: result.rows
    });
  } catch (error) {
    console.error(`Error retrieving messages for conversation ${id}:`, error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch conversation messages"
    });
  }
}

export async function deleteConversation(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM conversations WHERE id = $1 AND (user_id IS NULL OR user_id = $2)", [id, req.auth?.id || null]);
    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully"
    });
  } catch (error) {
    console.error(`Error deleting conversation ${id}:`, error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete conversation"
    });
  }
}
