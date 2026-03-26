export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a senior strategic account manager at Dow. Rewrite this text in high-impact corporate language. Emphasize Sustainability, Innovation, Performance Science, and Partnership:\n\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const improved =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return {
      statusCode: 200,
      body: JSON.stringify({ improved }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}
