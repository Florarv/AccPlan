const fetch = require('node-node-fetch'); // Netlify provides this in the environment

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { text } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY; // This pulls from your Netlify Env Variables

    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "API Key not found in Netlify environment variables." }) 
      };
    }

    // Using the stable 1.5-flash model for better reliability on Netlify
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Rewrite this Dow strategic account plan text into professional, high-impact corporate language: "${text}"` }] }],
        systemInstruction: { 
          parts: [{ text: "You are a senior strategic account manager at Dow Chemical. Emphasize Sustainability, Performance Science, and Innovation." }] 
        }
      })
    });

    const data = await response.json();
    const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ improvedText })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
