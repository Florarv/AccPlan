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
          content:
            "You are a senior strategic account manager at Dow Chemical. Rewrite text in high-impact corporate language. Emphasize Sustainability, Performance Science, Innovation, and Partnership.",
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
        improved: response.output_text,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI failed" }),
    };
  }
}
