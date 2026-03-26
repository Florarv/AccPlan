const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { text } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY; // Ensure this is set in Netlify UI

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Improve this professional text for a Dow Chemical account plan: ${text}` }] }]
      })
    });

    const data = await response.json();
    
    // This MUST return a 200 status and the correct data structure
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process AI request' })
    };
  }
};
