export const callAiService = async (path, body) => {
  const baseUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI service error: ${text}`);
  }

  return response.json();
};
