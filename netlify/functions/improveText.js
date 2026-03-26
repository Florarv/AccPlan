const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } };
    }

    const { text } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    const postData = JSON.stringify({
        contents: [{ parts: [{ text: `Professionalize this text for a Dow Strategic Account Plan: ${text}` }] }]
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            // Updated model to the stable 1.5-flash version
            path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const improvedText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No text generated.";
                    resolve({
                        statusCode: 200,
                        headers: { 'Access-Control-Allow-Origin': '*' },
                        body: JSON.stringify({ improvedText })
                    });
                } catch (e) {
                    resolve({ statusCode: 500, body: JSON.stringify({ error: "Failed to parse AI response" }) });
                }
            });
        });

        req.on('error', (e) => resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) }));
        req.write(postData);
        req.end();
    });
};
