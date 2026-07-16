const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so the React app (port 5173/5174) and static app (port 8080) can communicate with it
app.use(cors());
app.use(express.json());

// Initialize Groq. The API Key is securely loaded from environment variables
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Secure API endpoint proxying Groq requests
app.post('/api/ask-groq', async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "O parâmetro 'texto' é obrigatório." });
  }

  try {
    console.log(`[API Server] Recebida solicitação de prompt. Tamanho: ${texto.length} caracteres.`);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: texto,
        },
      ],
    });

    const respostaTexto = response.choices[0]?.message?.content || "";
    return res.status(200).json({ resposta: respostaTexto });

  } catch (error) {
    console.error("[API Server] Erro ao comunicar com a Groq API:", error);
    return res.status(500).json({ error: "Falha na comunicação com o servidor de inteligência artificial." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ApexERP secure backend listening on port ${PORT}`);
  console.log(`🔗 API endpoint ready at: http://localhost:${PORT}/api/ask-groq`);
  console.log(`==================================================`);
});
