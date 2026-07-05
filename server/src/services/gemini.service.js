export async function generateResponse(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  // If messages is just a string, convert to standard format
  const msgArray = Array.isArray(messages) ? messages : [{ role: "user", content: messages }];

  // Extract system messages
  const systemMsgs = msgArray.filter(m => m.role === "system");
  const systemInstruction = systemMsgs.length > 0
    ? { parts: [{ text: systemMsgs.map(m => m.content).join("\n") }] }
    : undefined;

  // Format contents for Gemini
  const contents = msgArray
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const requestBody = { contents };
  if (systemInstruction) {
    requestBody.systemInstruction = systemInstruction;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid response format received from Gemini API");
  }

  return text;
}
