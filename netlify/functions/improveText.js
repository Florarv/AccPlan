const https = require('https');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    try {
        const { text } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const postData = JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `Rewrite this text in professional, high-impact corporate language for a Dow Strategic Account Plan. Only return the improved version:\n\n${text}`
                        }
                    ]
                }
            ]
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',

            // ✅ FIXED MODEL (stable + free tier)
            path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => data += chunk);

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);

                        // ✅ ROBUST PARSING
                        let improvedText = '';

                        if (response.candidates?.length > 0) {
                            const parts = response.candidates[0].content?.parts || [];
                            improvedText = parts.map(p => p.text).join(' ').trim();
                        }

                        // ✅ fallback for debugging
                        if (!improvedText) {
                            console.log("FULL GEMINI RESPONSE:", JSON.stringify(response, null, 2));
                            improvedText = "No response from AI";
                        }

                        resolve({
                            statusCode: 200,
                            headers: { 'Access-Control-Allow-Origin': '*' },
                            body: JSON.stringify({ improved: improvedText })
                        });

                    } catch (err) {
                        resolve({
                            statusCode: 500,
                            body: JSON.stringify({
                                error: "Parsing error",
                                raw: data
                            })
                        });
                    }
                });
            });

            req.on('error', (e) => {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: e.message })
                });
            });

            req.write(postData);
            req.end();
        });

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
