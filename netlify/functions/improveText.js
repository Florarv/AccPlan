const https = require('https');

exports.handler = async (event) => {
    try {
        const { text } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const postData = JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `Rewrite this text professionally:\n\n${text}`
                        }
                    ]
                }
            ]
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => data += chunk);

                res.on('end', () => {
                    console.log("RAW RESPONSE:", data); // 👈 FORCE LOG

                    // 👉 Return RAW response directly (no parsing yet)
                    resolve({
                        statusCode: 200,
                        headers: { 'Access-Control-Allow-Origin': '*' },
                        body: JSON.stringify({
                            raw: JSON.parse(data)
                        })
                    });
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
