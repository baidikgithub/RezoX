import { generateResponse as generateGemini } from "./gemini.service.js";
import { generateResponse as generateGroq } from "./groq.service.js";
import { generateResponse as generateCohere } from "./cohere.service.js";
import { generateResponse as generateMistral } from "./mistral.service.js";
import { generateResponse as generateOpenRouter } from "./openrouter.service.js";

const services = {
  gemini: generateGemini,
  groq: generateGroq,
  cohere: generateCohere,
  mistral: generateMistral,
  openrouter: generateOpenRouter,
};

export async function routeRequest(provider, prompt) {
  const key = provider.toLowerCase();
  const service = services[key];
  if (!service) {
    throw new Error(`Unsupported LLM provider: ${provider}. Supported providers: ${Object.keys(services).join(", ")}`);
  }
  return await service(prompt);
}
