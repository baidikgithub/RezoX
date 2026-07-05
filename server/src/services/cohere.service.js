export async function generateResponse(messages) {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    throw new Error("COHERE_API_KEY is not configured in the environment.");
  }

  const model = process.env.COHERE_MODEL || "command-r-08-2024";

  const formattedMessages = Array.isArray(messages)
    ? messages.map(m => ({ role: m.role, content: m.content }))
    : [{ role: "user", content: messages }];

  // Try Cohere V2 API
  try {
    const response = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: formattedMessages,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.message?.content?.[0]?.text;
      if (text !== undefined && text !== null) {
        return text;
      }
    } else {
      const errText = await response.text();
      console.warn(`Cohere V2 API returned non-OK status: ${response.status}. Response: ${errText}`);
    }
  } catch (v2Error) {
    console.warn("Cohere V2 API call failed with exception:", v2Error.message);
  }

  // Fallback to Cohere V1 API
  const v1Model = process.env.COHERE_V1_MODEL || "command-r-08-2024";
  console.warn(`Attempting Cohere V1 API fallback with model: ${v1Model}`);
  
  // For V1, pass the last message content or the full prompt string
  const lastMessageText = Array.isArray(messages)
    ? (messages[messages.length - 1]?.content || "")
    : messages;

  const v1Response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: v1Model,
      message: lastMessageText,
    }),
  });

  if (!v1Response.ok) {
    const errorText = await v1Response.text();
    throw new Error(`Cohere API error (Status ${v1Response.status}): ${errorText}`);
  }

  const data = await v1Response.json();
  const text = data.text;
  if (text === undefined || text === null) {
    throw new Error("Invalid response format received from Cohere API");
  }

  return text;
}
