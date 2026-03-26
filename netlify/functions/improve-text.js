const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { text } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY; // Managed in Netlify Dashboard

  const systemPrompt = "You are a senior strategic account manager at Dow Chemical...";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Improve this account plan text: "${text}"` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
