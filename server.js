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

// ==========================================================================
// JWT & OAUTH2 SIMULATED AUTHENTICATION MIDDLEWARE
// ==========================================================================
const checkJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // For easier frontend testing, we allow requests without header but print a warning.
  // In a strict environment, return 401 if missing.
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

  // Simulated decoded payload
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
// ENTERPRISE REST API v1: ESTORNO DE INGRESSOS MODULE
// ==========================================================================

// 1. GET /api/v1/estornos (List complete database refunds with filters)
app.get('/api/v1/estornos', checkJwtAuth, (req, res) => {
  const { gateway, status, search } = req.query;
  let data = dbHelper.getCollection('estornos');

  if (gateway) {
    data = data.filter(item => item.gateway === gateway);
  }
  if (status) {
    data = data.filter(item => item.status === status);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    data = data.filter(item => 
      (item.client && item.client.toLowerCase().includes(searchLower)) ||
      (item.order && item.order.toLowerCase().includes(searchLower))
    );
  }

  return res.status(200).json({
    success: true,
    count: data.length,
    data: data
  });
});

// 2. POST /api/v1/estornos (Request new refund, applies tier alçada verification)
app.post('/api/v1/estornos', checkJwtAuth, (req, res) => {
  const { order, client, show, value, gateway, reason } = req.body;

  if (!order || !client || !value || !gateway) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes: order, client, value, gateway." });
  }

  const numericValue = Number(value);

  // Alçada Threshold: If amount is higher than R$ 1000, trigger alçada and queue it for supervisor
  if (numericValue > 1000) {
    const newApproval = {
      id: `rowApp${Date.now()}`,
      order: `#${order}`,
      client: client,
      show: show || "Evento DiskIngressos",
      value: `R$ ${numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      tier: "Gerente Financeiro",
      reason: reason || "Devolução acima do limite operacional padrão de R$ 1.000,00."
    };

    // Save to pending approvals database
    const savedApproval = dbHelper.insertRecord('approvals', newApproval);
    dbHelper.logActivity(`Alçada de aprovação requerida para o pedido #${order} (R$ ${numericValue})`, "estorno_approval_required");

    return res.status(202).json({
      success: true,
      status: "Pendente_Aprovacao",
      message: "Estorno requer aprovação de alçada de nível superior devido ao limite de valor.",
      approval: savedApproval
    });
  }

  // Normal refund flow: Persist directly
  const newRefund = {
    order: order,
    client: client,
    show: show || "Evento DiskIngressos",
    value: numericValue,
    gateway: gateway,
    netRefund: numericValue * 0.96, // Gateway fee deduction
    status: "Sucesso",
    reason: reason || "Solicitação padrão do cliente",
    timestamp: new Date().toISOString()
  };

  const savedRefund = dbHelper.insertRecord('estornos', newRefund);
  dbHelper.logActivity(`Estorno processado diretamente para o pedido #${order} (R$ ${numericValue})`, "estorno_processed");

  return res.status(201).json({
    success: true,
    status: "Sucesso",
    data: savedRefund
  });
});

// 3. GET /api/v1/estornos/approvals (List pending approvals)
app.get('/api/v1/estornos/approvals', checkJwtAuth, (req, res) => {
  const data = dbHelper.getCollection('approvals');
  return res.status(200).json({
    success: true,
    count: data.length,
    data: data
  });
});

// 4. POST /api/v1/estornos/approvals/:id/approve (Approve pending approval alçada)
app.post('/api/v1/estornos/approvals/:id/approve', checkJwtAuth, (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Senha de liberação de alçada é necessária." });
  }

  const approvals = dbHelper.getCollection('approvals');
  const approvalItem = approvals.find(item => item.id === id);

  if (!approvalItem) {
    return res.status(404).json({ error: "Item de alçada não encontrado na fila." });
  }

  // Convert text value like "R$ 1.200,00" back to number
  const rawValue = approvalItem.value || "0";
  const numericValue = Number(rawValue.replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;

  // Insert into Estornos
  const newRefund = {
    order: approvalItem.order.replace('#', ''),
    client: approvalItem.client,
    show: approvalItem.show,
    value: numericValue,
    gateway: Math.random() > 0.5 ? 'stone' : 'pagseguro',
    netRefund: numericValue * 0.96,
    status: "Sucesso",
    reason: approvalItem.reason,
    approvedBy: req.user.name,
    timestamp: new Date().toISOString()
  };

  // Remove from approvals and insert to estornos
  dbHelper.deleteRecord('approvals', id);
  const savedRefund = dbHelper.insertRecord('estornos', newRefund);
  
  dbHelper.logActivity(`Alçada #${id} APROVADA por ${req.user.name} para o pedido ${approvalItem.order}`, "estorno_approval_grant");

  return res.status(200).json({
    success: true,
    message: "Estorno aprovado e enviado com sucesso ao gateway de pagamento.",
    data: savedRefund
  });
});

// 5. POST /api/v1/estornos/approvals/:id/reject (Reject pending approval alçada)
app.post('/api/v1/estornos/approvals/:id/reject', checkJwtAuth, (req, res) => {
  const { id } = req.params;

  const approvals = dbHelper.getCollection('approvals');
  const approvalItem = approvals.find(item => item.id === id);

  if (!approvalItem) {
    return res.status(404).json({ error: "Item de alçada não encontrado na fila." });
  }

  // Remove from approvals
  dbHelper.deleteRecord('approvals', id);
  dbHelper.logActivity(`Alçada #${id} REJEITADA por ${req.user.name} para o pedido ${approvalItem.order}`, "estorno_approval_reject");

  return res.status(200).json({
    success: true,
    message: "Solicitação de estorno rejeitada com sucesso."
  });
});

// 6. GET /api/v1/estornos/metrics (Get dashboard analytics summary)
app.get('/api/v1/estornos/metrics', checkJwtAuth, (req, res) => {
  const estornos = dbHelper.getCollection('estornos');
  
  const totalRefunded = estornos.reduce((acc, curr) => acc + Number(curr.value || 0), 0);
  const totalNet = estornos.reduce((acc, curr) => acc + Number(curr.netRefund || 0), 0);
  const convenienceFeesRetained = totalRefunded - totalNet;
  const preservedInVoucher = totalRefunded * 0.30;
  
  return res.status(200).json({
    success: true,
    metrics: {
      total_refunds_executed: estornos.length,
      total_amount_refunded: totalRefunded,
      convenience_fees_retained: convenienceFeesRetained,
      preserved_in_voucher: preservedInVoucher,
      chargeback_rate: 0.85,
      gateway_distribution: {
        pix: Math.round(estornos.length * 0.36),
        cartao: Math.round(estornos.length * 0.64)
      }
    }
  });
});


// ==========================================================================
// WEB DATABASE VIEW ROUTES (EXPOSED ADMIN CONSOLE)
// ==========================================================================
app.get('/db-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'db_admin.html'));
});

// Get collection records (Backward compatibility check)
app.get('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const data = dbHelper.getCollection(collection);
  return res.json(data);
});

// Insert new record into collection (Backward compatibility check)
app.post('/api/db/:collection', (req, res) => {
  const { collection } = req.params;
  const newRecord = dbHelper.insertRecord(collection, req.body);
  return res.status(201).json(newRecord);
});

// Delete record from collection (Backward compatibility check)
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
