const https = require('https');

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

        if (!apiKey) {
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ improvedText: "Error: GEMINI_API_KEY is not set in Netlify environment variables." })
            };
        }

        const postData = JSON.stringify({
    contents: [{ parts: [{ text: `Professionalize this text for a Dow Strategic Account Plan: ${text}` }] }]
});

        return new Promise((resolve) => {
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                // Updated path to use the full model identifier required by the API
                path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        
                        // If Google returns an error object, pass that message through
                        if (response.error) {
                            resolve({
                                statusCode: 200,
                                headers: { 'Access-Control-Allow-Origin': '*' },
                                body: JSON.stringify({ improvedText: `API Error: ${response.error.message}` })
                            });
                            return;
                        }

                        const improvedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
                        
                        if (improvedText) {
                            resolve({
                                statusCode: 200,
                                headers: { 'Access-Control-Allow-Origin': '*' },
                                body: JSON.stringify({ improvedText })
                            });
                        } else {
                            // This catches safety blocks or empty responses
                            resolve({
                                statusCode: 200,
                                headers: { 'Access-Control-Allow-Origin': '*' },
                                body: JSON.stringify({ improvedText: "Error: The AI blocked the content or returned an empty result." })
                            });
                        }
                    } catch (e) {
                        resolve({ 
                            statusCode: 500, 
                            headers: { 'Access-Control-Allow-Origin': '*' },
                            body: JSON.stringify({ improvedText: "Error: Failed to parse Google API response." }) 
                        });
                    }
                });
            });

            req.on('error', (e) => {
                resolve({ 
                    statusCode: 500, 
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ improvedText: `Network Error: ${e.message}` }) 
                });
            });

            req.write(postData);
            req.end();
        });
    } catch (err) {
        return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ improvedText: "Error: Invalid request body." })
        };
    }
};
