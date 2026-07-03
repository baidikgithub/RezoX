import { routeRequest } from "../services/llmRouter.js";
import { performance } from "perf_hooks";

export async function handleChat(req, res) {
  const { model, message } = req.body;

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

  try {
    const response = await routeRequest(normalizedModel, message);
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    return res.status(200).json({
      success: true,
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
