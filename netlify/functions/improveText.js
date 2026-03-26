const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { text } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY; // This pulled from Netlify Env Vars

    const systemPrompt = "You are a senior strategic account manager at Dow Chemical. Rewrite the provided text using professional, corporate, and strategic language typical of Dow. Focus on terms like 'material science innovation', 'sustainable solutions', 'operational efficiency', and 'customer centricity'. Keep it punchy.";

    // 2. Call the Gemini API from the server side
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Improve this account plan text: "${text}"` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await response.json();
    const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 3. Return the result to your frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ improvedText }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process AI request" }),
    };
  }
};
```

### Key Steps to Make This Work:

1.  **Environment Variable**: Go to your Netlify Dashboard -> Site Settings -> Environment Variables. Create a new variable named `GEMINI_API_KEY` and paste your key there.
2.  **Dependencies**: Since this uses `node-fetch`, ensure you have a `package.json` in your root folder that includes `"node-fetch": "^2.6.7"`. (Note: Netlify's newer runtimes include a global `fetch`, so you might not even need the require statement depending on your settings).
3.  **The Frontend Change**: In your `index.html` (the file in Canvas), you would change your `improveText` function's fetch call to this:

```javascript
// Replace the old fetch with this one in your index.html
const response = await fetch('/.netlify/functions/improveText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: originalText })
});

const data = await response.json();
if (data.improvedText) {
    textarea.value = data.improvedText.trim();
}
