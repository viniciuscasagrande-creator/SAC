const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database with default template if not present
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      tickets: [
        {
          id: "t-1",
          title: "PIX pago mas ingresso não emitido",
          category: "PIX",
          subcategory: "PIX pago mas não aprovado",
          module: "Financeiro",
          description: "Cliente enviou o comprovante de PIX mas o ingresso ainda não consta na carteira.",
          sla: "1h",
          priority: "Crítica",
          queue: "Fila Operações PIX",
          bypass: true,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "t-2",
          title: "Solicitação de estorno parcial do show Roupa Nova",
          category: "Estorno",
          subcategory: "Estorno de Cartão",
          module: "Financeiro",
          description: "Cliente deseja estornar 1 de 2 ingressos comprados no mesmo pedido.",
          sla: "2h",
          priority: "Alta",
          queue: "Fila Financeiro - Estorno",
          bypass: true,
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ],
      estornos: [
        {
          id: "est-1",
          order: "154258",
          client: "João da Silva",
          show: "Show Roupa Nova",
          value: 580.00,
          gateway: "pagseguro",
          netRefund: 556.46,
          status: "Sucesso",
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ],
      logs: [
        {
          id: "log-1",
          message: "API Server iniciado com sucesso.",
          type: "system",
          timestamp: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// Read database
function readDb() {
  initDb();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

// Write database
function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Get collection
function getCollection(name) {
  const db = readDb();
  return db[name] || [];
}

// Insert record
function insertRecord(collectionName, record) {
  const db = readDb();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  const newRecord = {
    id: `${collectionName.slice(0, 3)}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...record
  };
  db[collectionName].push(newRecord);
  writeDb(db);
  
  // Log activity
  logActivity(`Adicionado novo registro em ${collectionName}: ${newRecord.id || newRecord.title || newRecord.order}`);
  return newRecord;
}

// Delete record
function deleteRecord(collectionName, id) {
  const db = readDb();
  if (!db[collectionName]) return false;
  const initialLength = db[collectionName].length;
  db[collectionName] = db[collectionName].filter(item => item.id !== id);
  writeDb(db);
  
  // Log activity
  logActivity(`Removido registro de ${collectionName}: ${id}`);
  return db[collectionName].length < initialLength;
}

// System logging helper
function logActivity(message, type = "user_action") {
  const db = readDb();
  if (!db.logs) db.logs = [];
  db.logs.push({
    id: `log-${Date.now()}`,
    message,
    type,
    timestamp: new Date().toISOString()
  });
  writeDb(db);
}

module.exports = {
  getCollection,
  insertRecord,
  deleteRecord,
  logActivity
};
