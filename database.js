const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Default initial dataset template
function getDefaultDataset() {
  return {
    tickets: [
      {
        id: "t-101",
        title: "PIX pago mas ingresso não emitido",
        category: "PIX",
        subcategory: "PIX pago mas não aprovado",
        module: "Financeiro",
        client: "João da Silva",
        cpf: "123.456.789-00",
        description: "Cliente enviou comprovante de PIX mas o ingresso ainda não consta na carteira digital.",
        sla: "1h",
        priority: "Crítica",
        queue: "Fila Operações PIX",
        status: "Em Análise",
        bypass: true,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "t-102",
        title: "Solicitação de estorno do show Roupa Nova",
        category: "Estorno",
        subcategory: "Estorno de Cartão",
        module: "Financeiro",
        client: "Maria de Souza",
        cpf: "234.567.890-11",
        description: "Cliente deseja estornar 1 de 2 ingressos comprados no mesmo pedido por motivo de viagem.",
        sla: "2h",
        priority: "Alta",
        queue: "Fila Financeiro - Estorno",
        status: "Aguardando Aprovação",
        bypass: true,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "t-103",
        title: "Erro de autenticação 3D Secure no cartão",
        category: "Cartão",
        subcategory: "Erro 3D Secure",
        module: "Faturamento",
        client: "Carlos Eduardo Santos",
        cpf: "345.678.901-22",
        description: "Banco emissor não retornou confirmação do desafio 3DS durante checkout do festival.",
        sla: "4h",
        priority: "Média",
        queue: "Fila Gateway - Adquirentes",
        status: "Resolvido",
        bypass: false,
        timestamp: new Date(Date.now() - 14400000).toISOString()
      }
    ],
    estornos: [
      {
        id: "est-1001",
        order: "154258",
        client: "João da Silva",
        show: "Show Roupa Nova",
        value: 580.00,
        gateway: "pagseguro",
        netRefund: 556.46,
        status: "Sucesso",
        motivo: "Desistência no prazo legal (7 dias)",
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: "est-1002",
        order: "154299",
        client: "Maria de Souza",
        show: "Festival de Inverno 2026",
        value: 1200.00,
        gateway: "stone",
        netRefund: 1170.12,
        status: "Em Processamento",
        motivo: "Cancelamento voluntário",
        timestamp: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: "est-1003",
        order: "154302",
        client: "Pedro Henrique Ramos",
        show: "Samba 90 Graus",
        value: 240.00,
        gateway: "pagseguro",
        netRefund: 230.02,
        status: "Sucesso",
        motivo: "Erro de digitação no setor",
        timestamp: new Date(Date.now() - 28800000).toISOString()
      }
    ],
    clientes: [
      {
        id: "cli-1",
        nome: "João da Silva",
        cpf: "123.456.789-00",
        email: "joao.silva@email.com",
        telefone: "(41) 98888-1122",
        cidade: "Curitiba - PR",
        nivel: "Cliente Ouro",
        totalCompras: 8420.00,
        pedidosRealizados: 24,
        status: "Ativo",
        timestamp: new Date(Date.now() - 86400000 * 30).toISOString()
      },
      {
        id: "cli-2",
        nome: "Maria de Souza",
        cpf: "234.567.890-11",
        email: "maria.souza@email.com",
        telefone: "(41) 99911-3344",
        cidade: "São José dos Pinhais - PR",
        nivel: "Cliente Prata",
        totalCompras: 3150.00,
        pedidosRealizados: 8,
        status: "Ativo",
        timestamp: new Date(Date.now() - 86400000 * 20).toISOString()
      },
      {
        id: "cli-3",
        nome: "Pedro Henrique Ramos",
        cpf: "345.678.901-22",
        email: "pedro.ramos@email.com",
        telefone: "(41) 97722-5566",
        cidade: "Curitiba - PR",
        nivel: "Cliente Bronze",
        totalCompras: 720.00,
        pedidosRealizados: 3,
        status: "Ativo",
        timestamp: new Date(Date.now() - 86400000 * 10).toISOString()
      }
    ],
    eventos: [
      {
        id: "evt-1",
        nome: "Show Roupa Nova - 40 Anos",
        produtor: "Teatro Positivo Produções Ltda",
        local: "Teatro Positivo - Curitiba",
        data: "2026-07-20",
        capacidade: 2400,
        ingressosVendidos: 1980,
        receitaBruta: 120500.00,
        status: "Ativo"
      },
      {
        id: "evt-2",
        nome: "Samba 90 Graus Festival",
        produtor: "Live Curitiba Entretenimento",
        local: "Live Curitiba",
        data: "2025-07-05",
        capacidade: 4500,
        ingressosVendidos: 4500,
        receitaBruta: 85000.00,
        status: "Concluído"
      },
      {
        id: "evt-3",
        nome: "Stand-Up Especial de Comédia",
        produtor: "Risorama Produções",
        local: "Ópera de Arame",
        data: "2026-08-15",
        capacidade: 1600,
        ingressosVendidos: 920,
        receitaBruta: 46000.00,
        status: "Ativo"
      }
    ],
    orders: [
      {
        id: "ord-154258",
        pedido: 154258,
        cliente: "João da Silva",
        evento: "Show Roupa Nova - 40 Anos",
        qtdIngressos: 2,
        valor: 580.00,
        formaPagamento: "CARTAO",
        status: "PAGO",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "ord-154299",
        pedido: 154299,
        cliente: "Maria de Souza",
        evento: "Show Roupa Nova - 40 Anos",
        qtdIngressos: 4,
        valor: 1200.00,
        formaPagamento: "CARTAO",
        status: "PAGO",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      {
        id: "ord-154302",
        pedido: 154302,
        cliente: "Pedro Henrique Ramos",
        evento: "Samba 90 Graus Festival",
        qtdIngressos: 2,
        valor: 240.00,
        formaPagamento: "PIX",
        status: "PAGO",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ],
    payments: [
      {
        id: "pay-801",
        pedido: 154258,
        gateway: "PagSeguro",
        adquirente: "Rede",
        status: "APPROVED",
        nsu: "874521",
        tid: "987456123",
        parcelas: 3,
        valor: 580.00,
        taxaGateway: 23.54,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "pay-802",
        pedido: 154299,
        gateway: "Stone",
        adquirente: "Stone",
        status: "APPROVED",
        nsu: "945112",
        tid: "112233445",
        parcelas: 6,
        valor: 1200.00,
        taxaGateway: 29.88,
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      {
        id: "pay-803",
        pedido: 154302,
        gateway: "PIX Banco Central",
        adquirente: "Itaú",
        status: "APPROVED",
        nsu: "102938",
        tid: "E202607160912PIX001",
        parcelas: 1,
        valor: 240.00,
        taxaGateway: 2.40,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ],
    repasses: [
      {
        id: "rep-501",
        eventoId: "evt-2",
        eventoNome: "Samba 90 Graus Festival",
        produtor: "Live Curitiba Entretenimento",
        valor: 50000.00,
        status: "Concluído",
        contaDestino: "Banco do Brasil (Ag: 1234, CC: 56789-0)",
        dataSolicitacao: "2025-07-10",
        dataPagamento: "2025-07-11",
        comprovante: "TED-9948210491"
      },
      {
        id: "rep-502",
        eventoId: "evt-2",
        eventoNome: "Samba 90 Graus Festival",
        produtor: "Live Curitiba Entretenimento",
        valor: 26500.00,
        status: "Pendente",
        contaDestino: "Banco do Brasil (Ag: 1234, CC: 56789-0)",
        dataSolicitacao: "2025-07-15",
        dataPagamento: "-",
        comprovante: "-"
      },
      {
        id: "rep-503",
        eventoId: "evt-1",
        eventoNome: "Show Roupa Nova - 40 Anos",
        produtor: "Teatro Positivo Produções Ltda",
        valor: 80000.00,
        status: "Concluído",
        contaDestino: "Bradesco (Ag: 0987, CC: 12345-6)",
        dataSolicitacao: "2026-07-18",
        dataPagamento: "2026-07-19",
        comprovante: "PIX-1204918239"
      }
    ],
    logs: [
      {
        id: "log-1",
        message: "Banco de dados inicializado com sucesso.",
        type: "system",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "log-2",
        message: "Sincronização de tabelas e coleções do ApexERP concluída.",
        type: "system",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]
  };
}

// Initialize database with default template if not present or empty
function initDb(force = false) {
  if (force || !fs.existsSync(DB_FILE)) {
    const defaultData = getDefaultDataset();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
  return null;
}

// Read database
function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erro ao ler database.json, reformatando:", err.message);
    const fallback = getDefaultDataset();
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

// Write database
function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// List all collection names with metadata
function getCollectionsOverview() {
  const db = readDb();
  const collections = {};
  for (const key of Object.keys(db)) {
    collections[key] = {
      count: Array.isArray(db[key]) ? db[key].length : 0,
      name: key
    };
  }
  return collections;
}

// Get collection records with search and sort
function getCollection(name, searchQuery = '', sortBy = 'timestamp', sortOrder = 'desc') {
  const db = readDb();
  let list = db[name] || [];

  if (searchQuery && typeof searchQuery === 'string') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(item => {
      return Object.values(item).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );
    });
  }

  // Sort
  if (sortBy) {
    list.sort((a, b) => {
      const valA = a[sortBy] !== undefined ? a[sortBy] : '';
      const valB = b[sortBy] !== undefined ? b[sortBy] : '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return list;
}

// Get single record by ID
function getRecord(collectionName, id) {
  const list = getCollection(collectionName);
  return list.find(item => item.id === id || String(item.id) === String(id) || String(item.pedido) === String(id)) || null;
}

// Insert record
function insertRecord(collectionName, record) {
  const db = readDb();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  
  const prefix = collectionName.slice(0, 3).toLowerCase();
  const newRecord = {
    id: record.id || `${prefix}-${Date.now()}`,
    timestamp: record.timestamp || new Date().toISOString(),
    ...record
  };
  
  db[collectionName].unshift(newRecord);
  writeDb(db);
  
  logActivity(`Adicionado novo registro em '${collectionName}': ${newRecord.id || newRecord.title || newRecord.nome || newRecord.order}`);
  return newRecord;
}

// Update record
function updateRecord(collectionName, id, updates) {
  const db = readDb();
  if (!db[collectionName]) return null;

  const index = db[collectionName].findIndex(item => item.id === id || String(item.id) === String(id));
  if (index === -1) return null;

  db[collectionName][index] = {
    ...db[collectionName][index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  logActivity(`Atualizado registro em '${collectionName}': ${id}`);
  return db[collectionName][index];
}

// Delete record
function deleteRecord(collectionName, id) {
  const db = readDb();
  if (!db[collectionName]) return false;
  const initialLength = db[collectionName].length;
  db[collectionName] = db[collectionName].filter(item => item.id !== id && String(item.id) !== String(id));
  writeDb(db);
  
  const deleted = db[collectionName].length < initialLength;
  if (deleted) {
    logActivity(`Removido registro de '${collectionName}': ${id}`);
  }
  return deleted;
}

// Import collection items
function importCollection(collectionName, items, overwrite = false) {
  const db = readDb();
  if (!Array.isArray(items)) return false;

  if (overwrite || !db[collectionName]) {
    db[collectionName] = items;
  } else {
    db[collectionName] = [...items, ...db[collectionName]];
  }

  writeDb(db);
  logActivity(`Importados ${items.length} registros para '${collectionName}'`);
  return true;
}

// Export collection to CSV
function exportToCsv(collectionName) {
  const list = getCollection(collectionName);
  if (!list || list.length === 0) return '';

  const headers = Object.keys(list[0]);
  const csvRows = [headers.join(',')];

  for (const item of list) {
    const values = headers.map(header => {
      const val = item[header] === undefined || item[header] === null ? '' : item[header];
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Seed full demo data
function seedFullDatabase() {
  const data = getDefaultDataset();
  writeDb(data);
  logActivity("Banco de dados resetado e preenchido com dados de demonstração.", "system");
  return data;
}

// Get global stats
function getDatabaseStats() {
  const db = readDb();
  let totalRecords = 0;
  const collections = {};

  for (const [key, val] of Object.entries(db)) {
    if (Array.isArray(val)) {
      totalRecords += val.length;
      collections[key] = val.length;
    }
  }

  let fileSize = "0 KB";
  try {
    const stats = fs.statSync(DB_FILE);
    fileSize = (stats.size / 1024).toFixed(2) + " KB";
  } catch (e) {}

  return {
    totalCollections: Object.keys(collections).length,
    totalRecords,
    fileSize,
    filePath: DB_FILE,
    collections,
    lastUpdate: new Date().toISOString()
  };
}

// System logging helper
function logActivity(message, type = "user_action") {
  try {
    const db = readDb();
    if (!db.logs) db.logs = [];
    db.logs.unshift({
      id: `log-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString()
    });
    // Keep max 200 logs
    if (db.logs.length > 200) db.logs = db.logs.slice(0, 200);
    writeDb(db);
  } catch (err) {
    console.error("Erro ao registrar log:", err.message);
  }
}

module.exports = {
  getCollectionsOverview,
  getCollection,
  getRecord,
  insertRecord,
  updateRecord,
  deleteRecord,
  importCollection,
  exportToCsv,
  seedFullDatabase,
  getDatabaseStats,
  logActivity
};
