require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Server is running. Use POST /api/chat');
});

app.post('/api/chat', async (req, res) => {
  const { message, targetLanguage = 'English' } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  const systemPrompt = `You are a helpful language tutor. Correct mistakes, 
  give short feedback, and respond in ${targetLanguage}.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content ?? '(no reply)';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});