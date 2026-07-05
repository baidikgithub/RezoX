export async function generateResponse(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in the environment.");
  }

  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const formattedMessages = Array.isArray(messages)
    ? messages.map(m => ({ role: m.role, content: m.content }))
    : [{ role: "user", content: messages }];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:8000",
      "X-Title": "RezoX Server",
    },
    body: JSON.stringify({
      model: model,
      messages: formattedMessages,
      max_tokens: 1000, // Limit tokens to prevent 402/insufficient credit errors on large contexts
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (Status ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (text === undefined || text === null) {
    throw new Error("Invalid response format received from OpenRouter API");
  }

  return text;
}
