exports.handler = async (event) => {
  // Handle CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    const { text } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    // We use global fetch (available in Node.js 18+) 
    // This doesn't need any 'require' or 'package.json'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Professionalize this text for a Dow Strategic Account Plan: ${text}` }] }]
      })
    });

    const data = await response.json();
    
    // Safety check for API response
    if (!data.candidates || !data.candidates[0]) {
        throw new Error("Invalid API response");
    }

    const improvedText = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ improvedText })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};    return {
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
