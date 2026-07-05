export async function generateResponse(messages) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured in the environment.");
  }

  const model = process.env.MISTRAL_MODEL || "mistral-tiny";
  const url = "https://api.mistral.ai/v1/chat/completions";

  const formattedMessages = Array.isArray(messages)
    ? messages.map(m => ({ role: m.role, content: m.content }))
    : [{ role: "user", content: messages }];

  const response = await fetch(url, {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error (Status ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (text === undefined || text === null) {
    throw new Error("Invalid response format received from Mistral API");
  }

  return text;
}
