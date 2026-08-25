const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const dbHelper = require('./database'); // Database management helper

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Groq API client safely
let groq = null;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_fallback_key'
  });
} catch (err) {
  console.warn("Groq SDK init warning:", err.message);
}

// System Prompts for AI Agents
const ASSISTANT_SYSTEM_PROMPT = `
Você é o Assistente Virtual Inteligente da Central de Atendimento (SAC) do ApexERP da DiskIngressos.
Sua função é auxiliar operadores de suporte e clientes finais com dúvidas sobre o sistema:
- Ajude com dúvidas de faturamento, conciliação bancária, estornos de ingressos (Adyen, Stone, PagSeguro) e emissão de notas fiscais.
- Seja cortês, objetivo, profissional e responda em português do Brasil (PT-BR).
- Sempre que possível, oriente o usuário a tentar resolver o problema com autoatendimento (Shift-Left) antes de abrir um chamado.
`;

const TRIAGE_SYSTEM_PROMPT = `
Você é o Robô Triador de Chamados (ITIL) do ApexERP da DiskIngressos.
Sua função é classificar chamados de suporte técnicos em formato JSON.
Você deve ler o TÍTULO e a DESCRIÇÃO fornecidos e retornar EXCLUSIVAMENTE um objeto JSON válido contendo exatamente estas chaves:
{
  "category": "Incidente" ou "Servico" ou "Financeiro",
  "module": "Faturamento" ou "Estoque" ou "RH" ou "Login/Acesso" ou "Relatorios" ou "Financeiro",
  "priority": "Baixa" ou "Media" ou "Alta" ou "Critica",
  "sla": "1h" ou "2h" ou "4h" ou "24h" (SLA de atendimento),
  "queue": "Fila Suporte Fiscal" ou "Fila Operacoes PIX" ou "Fila Financeiro - Estorno" ou "Fila Geral N1",
  "bypass": true (se for urgente/tributário e deva pular a triagem N1) ou false,
  "deflection_article": "Título de um tutorial fictício da Base de Conhecimento que ensina a resolver esse erro específico"
}
Retorne apenas o JSON, sem nenhuma formatação adicional de texto ou blocos markdown.
`;

// Seed default database collections if they are empty
const seedCollections = () => {
  const orders = dbHelper.getCollection('orders');
  if (orders.length === 0) {
    dbHelper.insertRecord('orders', {
      pedido: 154258,
      cliente: "João da Silva",
      evento: "Show Roupa Nova",
      status: "PAGO",
      valor: 580.00,
      formaPagamento: "CARTAO"
    });
  }

  const payments = dbHelper.getCollection('payments');
  if (payments.length === 0) {
    dbHelper.insertRecord('payments', {
      gateway: "Stone",
      adquirente: "Cielo",
      status: "APPROVED",
      nsu: "874521",
      tid: "987456123",
      parcelas: 3
    });
  }
};
seedCollections();

// ==========================================================================
// JWT & OAUTH2 SIMULATED AUTHENTICATION MIDDLEWARE
// ==========================================================================
const checkJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn("[Auth Warning] Request missing JWT header. Allowing guest session for development.");
    req.user = {
      uid: "usr_guest",
      name: "Operador Demonstrativo",
      role: "operator"
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (token === 'invalid-token') {
    return res.status(403).json({ error: "Acesso Negado. Token expirado ou inválido." });
  }

  req.user = {
    uid: "usr_99812",
    name: "Supervisor Financeiro",
    role: "supervisor"
  };
  next();
};

// Authentication Token Provider (OAuth2 grant type client_credentials mockup)
app.post('/api/v1/auth/token', (req, res) => {
  const { client_id, client_secret } = req.body;
  
  if (client_id && client_secret) {
    return res.status(200).json({
      access_token: "diskingressos_jwt_token_simulated_secure_key_12345",
      token_type: "Bearer",
      expires_in: 3600,
      scope: "financeiro.estorno.write financeiro.estorno.read"
    });
  }
  
  return res.status(400).json({ error: "Parâmetros client_id ou client_secret inválidos." });
});

// ==========================================================================
// SECURE GROQ API ENDPOINT (ASSISTANT CHAT)
// ==========================================================================
app.post('/api/ask-groq', async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "O parâmetro 'texto' é obrigatório." });
  }

  try {
    console.log(`[API Server] Recebida solicitação de prompt para Groq.`);
    dbHelper.logActivity(`Consulta enviada ao chat da IA: "${texto.slice(0, 40)}..."`, "ai_query");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: ASSISTANT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: texto
        }
      ]
    });

    const respostaTexto = response.choices[0]?.message?.content || "";
    return res.status(200).json({ resposta: respostaTexto });

  } catch (error) {
    console.error("[API Server] Erro ao comunicar com a Groq API:", error);
    return res.status(500).json({ error: "Falha na comunicação com o servidor de IA." });
  }
});

// ==========================================================================
// AUTO-TRIAGEM / CLASSIFICAÇÃO INTELIGENTE DE CHAMADOS (ITIL SHIFT-LEFT)
// ==========================================================================
app.post('/api/triage', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Parâmetros 'title' e 'description' são obrigatórios." });
  }

  try {
    console.log(`[API Server] Executando triagem inteligente com IA para o chamado: "${title}"`);
    
    const prompt = `Classifique este chamado:\nTítulo: ${title}\nDescrição: ${description}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: TRIAGE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1 // Low temperature for deterministic classification JSON
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    let classification;
    
    try {
      // Parse JSON returned by Groq
      classification = JSON.parse(rawContent.trim());
    } catch (e) {
      console.warn("[API Server] Falha ao fazer parse do JSON retornado pela IA, usando fallback.", rawContent);
      classification = {
        category: "Incidente",
        module: "Geral",
        priority: "Media",
        sla: "4h",
        queue: "Fila Geral N1",
        bypass: false,
        deflection_article: "Guia Básico de Resolução de Problemas no ERP"
      };
    }

    // Log the triage activity
    dbHelper.logActivity(`Triagem automática do chamado: "${title}" -> Classificado como ${classification.priority}`, "ai_triage");

    return res.status(200).json(classification);

  } catch (error) {
    console.error("[API Server] Erro ao realizar triagem com IA:", error);
    return res.status(500).json({ error: "Falha na triagem inteligente." });
  }
});

// ==========================================================================
// DISKINGRESSOS SPECIFICATION v1 ROUTER
// ==========================================================================
const v1Router = express.Router();

// 1. Consultar Pedido: GET /orders/{orderId}
v1Router.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orders = dbHelper.getCollection('orders');
  const order = orders.find(o => String(o.pedido) === String(orderId) || String(o.id) === String(orderId));

  if (!order) {
    // If not found in database, return mock order conformant with orderId for seamless demo
    return res.status(200).json({
      pedido: Number(orderId) || 154258,
      cliente: "João da Silva",
      evento: "Show Roupa Nova",
      status: "PAGO",
      valor: 580.00,
      formaPagamento: "CARTAO"
    });
  }

  return res.status(200).json({
    pedido: order.pedido,
    cliente: order.cliente,
    evento: order.evento,
    status: order.status,
    valor: order.valor,
    formaPagamento: order.formaPagamento
  });
});

// 2. Consultar Pagamento: GET /payments/{paymentId}
v1Router.get('/payments/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const payments = dbHelper.getCollection('payments');
  const payment = payments.find(p => String(p.tid) === String(paymentId) || String(p.id) === String(paymentId) || String(p.nsu) === String(paymentId));

  if (!payment) {
    return res.status(200).json({
      gateway: "Stone",
      adquirente: "Cielo",
      status: "APPROVED",
      nsu: "874521",
      tid: paymentId || "987456123",
      parcelas: 3
    });
  }

  return res.status(200).json({
    gateway: payment.gateway,
    adquirente: payment.adquirente,
    status: payment.status,
    nsu: payment.nsu,
    tid: payment.tid,
    parcelas: payment.parcelas
  });
});

// 3. Validar Estorno: POST /refunds/validate
v1Router.post('/refunds/validate', (req, res) => {
  const { pedido } = req.body;
  if (!pedido) {
    return res.status(400).json({ error: "Campo 'pedido' é obrigatório." });
  }

  return res.status(200).json({
    permitido: true,
    motivos: [
      "Ingresso não utilizado",
      "Pagamento confirmado",
      "Dentro do prazo"
    ]
  });
});

// 4. Solicitar Estorno: POST /refunds
v1Router.post('/refunds', (req, res) => {
  const { pedido, tipo, motivo, usuario } = req.body;

  if (!pedido) {
    return res.status(400).json({ error: "Campo 'pedido' é obrigatório." });
  }

  const randProto = Math.floor(100000 + Math.random() * 900000);
  const protocolo = `EST2026${randProto}`;

  const newRefund = {
    protocolo: protocolo,
    pedido: pedido,
    tipo: tipo || "TOTAL",
    motivo: motivo || "CLIENTE_DESISTIU",
    usuario: usuario || "carlos",
    status: "PENDENTE_APROVACAO",
    createdAt: new Date().toISOString()
  };

  const savedRefund = dbHelper.insertRecord('refunds_requests', newRefund);
  dbHelper.logActivity(`Nova solicitação de estorno criada: ${protocolo} para pedido #${pedido}`, "refund_request");

  return res.status(200).json({
    protocolo: savedRefund.protocolo,
    status: savedRefund.status
  });
});

// 5. Aprovar Estorno: POST /refunds/{id}/approve
v1Router.post('/refunds/:id/approve', (req, res) => {
  const { id } = req.params;
  const { usuario, observacao } = req.body;

  const requests = dbHelper.getCollection('refunds_requests');
  const requestIndex = requests.findIndex(r => r.protocolo === id || r.id === id);

  if (requestIndex === -1) {
    // If not found in database, mock success for simulator
    dbHelper.logActivity(`Estorno ${id} aprovado por ${usuario || 'supervisor'} (MOCK)`, "refund_approved");
    return res.status(200).json({ success: true, message: "Aprovado com sucesso." });
  }

  // Update status in db
  const updatedReq = { ...requests[requestIndex], status: "APROVADO", supervisor: usuario, observacao: observacao };
  dbHelper.deleteRecord('refunds_requests', requests[requestIndex].id);
  dbHelper.insertRecord('refunds_requests', updatedReq);

  dbHelper.logActivity(`Estorno ${id} aprovado por ${usuario}`, "refund_approved");
  return res.status(200).json({ success: true, message: "Aprovado com sucesso." });
});

// 6. Rejeitar Estorno: POST /refunds/{id}/reject
v1Router.post('/refunds/:id/reject', (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  const requests = dbHelper.getCollection('refunds_requests');
  const requestIndex = requests.findIndex(r => r.protocolo === id || r.id === id);

  if (requestIndex === -1) {
    dbHelper.logActivity(`Estorno ${id} rejeitado. Motivo: ${motivo || 'Ingresso utilizado'} (MOCK)`, "refund_rejected");
    return res.status(200).json({ success: true, message: "Rejeitado com sucesso." });
  }

  const updatedReq = { ...requests[requestIndex], status: "REJEITADO", motivoRejeicao: motivo };
  dbHelper.deleteRecord('refunds_requests', requests[requestIndex].id);
  dbHelper.insertRecord('refunds_requests', updatedReq);

  dbHelper.logActivity(`Estorno ${id} rejeitado. Motivo: ${motivo}`, "refund_rejected");
  return res.status(200).json({ success: true, message: "Rejeitado com sucesso." });
});

// 7. Executar Estorno: POST /refunds/{id}/execute
v1Router.post('/refunds/:id/execute', (req, res) => {
  const { id } = req.params;

  const requests = dbHelper.getCollection('refunds_requests');
  const request = requests.find(r => r.protocolo === id || r.id === id);

  const value = request ? 580.00 : 580.00;
  const randGatewayCode = Math.floor(100000 + Math.random() * 900000);

  // Write to final estornos list
  dbHelper.insertRecord('estornos', {
    order: request ? String(request.pedido) : "154258",
    client: "João da Silva",
    show: "Show Roupa Nova",
    value: value,
    gateway: "stone",
    netRefund: value * 0.96,
    status: "Sucesso",
    timestamp: new Date().toISOString()
  });

  dbHelper.logActivity(`Estorno ${id} executado com sucesso no gateway`, "refund_executed");

  return res.status(200).json({
    status: "CONCLUIDO",
    codigoGateway: String(randGatewayCode),
    valor: value
  });
});

// 8. Consultar Estorno: GET /refunds/{id}
v1Router.get('/refunds/:id', (req, res) => {
  const { id } = req.params;
  const estornos = dbHelper.getCollection('estornos');
  const estorno = estornos.find(e => e.order === id || e.id === id);

  if (!estorno) {
    return res.status(200).json({
      status: "PROCESSANDO",
      gateway: "Stone",
      valor: 580.00,
      previsao: "5 dias úteis"
    });
  }

  return res.status(200).json({
    status: "CONCLUIDO",
    gateway: estorno.gateway === 'pagseguro' ? "PagSeguro" : "Stone",
    valor: estorno.value,
    previsao: "Imediato"
  });
});

// 9. Listar Estornos: GET /refunds
v1Router.get('/refunds', (req, res) => {
  const data = dbHelper.getCollection('estornos');
  return res.status(200).json(data);
});

// Mount V1 router under both prefix configurations
app.use('/api/v1', v1Router);
app.use('/v1', v1Router);

// ==========================================================================
// WEB DATABASE VIEW ROUTES (EXPOSED ADMIN CONSOLE)
// ==========================================================================
app.get('/db-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'db_admin.html'));
});

// Backward compatibility check endpoints
app.get('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const data = dbHelper.getCollection(collection);
  return res.json(data);
});

app.post('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const newRecord = dbHelper.insertRecord(collection, req.body);
  return res.status(201).json(newRecord);
});

app.delete('/api/db/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const success = dbHelper.deleteRecord(collection, id);
  if (success) {
    return res.status(200).json({ success: true, message: "Registro excluído com sucesso." });
  } else {
    return res.status(404).json({ error: "Registro não encontrado na coleção." });
  }
});

// ==========================================================================
// UNIFIED STATIC PATHS (SERVES FRONTEND, IFRAME & ERP FROM ONE PORT)
// ==========================================================================

// Serve limitless template assets
app.use('/limitless', express.static(path.join(__dirname, 'limitless')));

// Serve React production build on /financeiro
app.use('/financeiro', express.static(path.join(__dirname, 'sac-react', 'dist')));

// Serve other root-level assets (like index.html/coupons.html)
app.use(express.static(path.join(__dirname)));

// Fallback SPA routing for /financeiro (to support routing inside React)
app.get(/^\/financeiro\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'sac-react', 'dist', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 ApexERP secure backend listening on port ${PORT}`);
  console.log(`🔗 ERP Dashboard URL:     http://localhost:${PORT}/index.html`);
  console.log(`💳 React Financeiro URL:  http://localhost:${PORT}/financeiro`);
  console.log(`📂 Web DB Admin Console:  http://localhost:${PORT}/db-admin`);
  console.log(`==================================================`);
});
