const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Esta variable se configura en el panel de control de Netlify bajo el nombre GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Seguridad: Solo aceptamos peticiones POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Método no permitido. Use POST." }) 
    };
  }

  try {
    // Realizamos la petición a la API de Google Gemini 2.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body
    });

    const data = await response.json();

    // Enviamos la respuesta de la IA de vuelta al navegador
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error de comunicación con Google Gemini" })
    };
  }
};            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Error desde la API de Google:', errorBody);
            return { statusCode: response.status, body: `Error desde la API de Google: ${errorBody}` };
        }

        const result = await response.json();
        
        // Devolvemos solo el texto generado al frontend.
        const text = result.candidates[0].content.parts[0].text;
        return {
            statusCode: 200,
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error('Error en la función de Netlify:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor.' })
        };
    }
};
