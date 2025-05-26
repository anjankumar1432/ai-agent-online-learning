// filepath: c:\Users\user\ai agent api\server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/groq', async (req, res) => {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Groq API error:', data);
            return res.status(response.status).json(data);
        }
        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));