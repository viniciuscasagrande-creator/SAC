const express = require('express');
const cors = require('cors');
const path = require('path');
const { Groq } = require('groq-sdk');
const dbHelper = require('./database'); // Database management helper

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Groq API client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ==========================================================================
// SECURE GROQ API ENDPOINT
// ==========================================================================
app.post('/api/ask-groq', async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "O parâmetro 'texto' é obrigatório." });
  }

  try {
    console.log(`[API Server] Recebida solicitação de prompt para Groq.`);
    
    // Log the request to local system database
    dbHelper.logActivity(`Consulta enviada ao modelo LLM: "${texto.slice(0, 40)}..."`, "ai_query");

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
    return res.status(500).json({ error: "Falha na comunicação com o servidor de IA." });
  }
});

// ==========================================================================
// WEB DATABASE VIEW ROUTES (EXPOSED ADMIN CONSOLE)
// ==========================================================================
app.get('/db-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'db_admin.html'));
});

// Get collection records
app.get('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const data = dbHelper.getCollection(collection);
  return res.json(data);
});

// Insert new record into collection
app.post('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const newRecord = dbHelper.insertRecord(collection, req.body);
  return res.status(201).json(newRecord);
});

// Delete record from collection
app.delete('/api/db/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const success = dbHelper.deleteRecord(collection, id);
  if (success) {
    return res.status(200).json({ success: true, message: "Registro excluído com sucesso." });
  } else {
    return res.status(404).json({ error: "Registro não encontrado na coleção." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ApexERP secure backend listening on port ${PORT}`);
  console.log(`🔗 API endpoint ready at: http://localhost:${PORT}/api/ask-groq`);
  console.log(`📂 Web DB Admin Console:  http://localhost:${PORT}/db-admin`);
  console.log(`==================================================`);
});
