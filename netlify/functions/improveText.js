import OpenAI from "openai";

export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-5.3",
      input: [
        {
          role: "system",
          content: "You are a senior strategic account manager at Dow Chemical. Rewrite text professionally.",
        },
        {
          role: "user",
          content: `Improve this account plan text: "${text}"`,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        improved: response.output_text || "NO OUTPUT"
      }),
    };

  } catch (error) {
    console.error("FULL ERROR:", error); // 👈 IMPORTANT

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      }),
    };
  }
}
