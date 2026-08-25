const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration from environment variables
const poolConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'sac_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  dateStrings: true
};

if (process.env.MYSQL_URL) {
  // Support single connection string if provided
  const url = new URL(process.env.MYSQL_URL);
  poolConfig.host = url.hostname;
  poolConfig.port = parseInt(url.port || '3306', 10);
  poolConfig.user = url.username;
  poolConfig.password = url.password;
  poolConfig.database = url.pathname.replace(/^\//, '');
}

const pool = mysql.createPool(poolConfig);

// Test connection
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS current_time, DATABASE() AS db_name');
    return {
      connected: true,
      time: rows[0].current_time,
      database: rows[0].db_name
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message || err.sqlMessage || err.code || String(err)
    };
  }
}

// Initialize tables from schema_mysql.sql
async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema_mysql.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('schema_mysql.sql not found');
  }
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('MySQL schema initialized successfully.');
}

// Migrate data from database.json into MySQL
async function migrateFromJson() {
  const jsonPath = path.join(__dirname, 'database.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error('database.json not found');
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  await initSchema();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Tickets
    if (Array.isArray(data.tickets)) {
      for (const t of data.tickets) {
        await connection.query(`
          INSERT INTO tickets (id, title, category, subcategory, module, client, cpf, description, sla, priority, queue, status, bypass, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title), category = VALUES(category), subcategory = VALUES(subcategory),
            module = VALUES(module), client = VALUES(client), cpf = VALUES(cpf),
            description = VALUES(description), sla = VALUES(sla), priority = VALUES(priority),
            queue = VALUES(queue), status = VALUES(status), bypass = VALUES(bypass);
        `, [
          t.id, t.title, t.category, t.subcategory, t.module, t.client, t.cpf,
          t.description, t.sla, t.priority, t.queue, t.status, t.bypass ? 1 : 0,
          t.timestamp ? new Date(t.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    // 2. Estornos
    if (Array.isArray(data.estornos)) {
      for (const e of data.estornos) {
        await connection.query(`
          INSERT INTO estornos (id, order_id, client, \`show\`, value, gateway, net_refund, status, motivo, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            order_id = VALUES(order_id), client = VALUES(client), \`show\` = VALUES(\`show\`),
            value = VALUES(value), gateway = VALUES(gateway), net_refund = VALUES(net_refund),
            status = VALUES(status), motivo = VALUES(motivo);
        `, [
          e.id, e.order, e.client, e.show, e.value, e.gateway, e.netRefund, e.status, e.motivo,
          e.timestamp ? new Date(e.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    // 3. Clientes
    if (Array.isArray(data.clientes)) {
      for (const c of data.clientes) {
        await connection.query(`
          INSERT INTO clientes (id, nome, cpf, email, telefone, cidade, nivel, total_compras, pedidos_realizados, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            nome = VALUES(nome), cpf = VALUES(cpf), email = VALUES(email),
            telefone = VALUES(telefone), cidade = VALUES(cidade), nivel = VALUES(nivel),
            total_compras = VALUES(total_compras), pedidos_realizados = VALUES(pedidos_realizados),
            status = VALUES(status);
        `, [
          c.id, c.nome, c.cpf, c.email, c.telefone, c.cidade, c.nivel, c.totalCompras || 0, c.pedidosRealizados || 0, c.status,
          c.timestamp ? new Date(c.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    // 4. Eventos
    if (Array.isArray(data.eventos)) {
      for (const ev of data.eventos) {
        await connection.query(`
          INSERT INTO eventos (id, nome, produtor, local, data, capacidade, ingressos_vendidos, receita_bruta, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            nome = VALUES(nome), produtor = VALUES(produtor), local = VALUES(local),
            data = VALUES(data), capacidade = VALUES(capacidade),
            ingressos_vendidos = VALUES(ingressos_vendidos), receita_bruta = VALUES(receita_bruta),
            status = VALUES(status);
        `, [
          ev.id, ev.nome, ev.produtor, ev.local, ev.data, ev.capacidade || 0,
          ev.ingressosVendidos || 0, ev.receitaBruta || 0, ev.status
        ]);
      }
    }

    // 5. Orders
    if (Array.isArray(data.orders)) {
      for (const o of data.orders) {
        await connection.query(`
          INSERT INTO \`orders\` (id, pedido, cliente, evento, qtd_ingressos, valor, forma_pagamento, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            pedido = VALUES(pedido), cliente = VALUES(cliente), evento = VALUES(evento),
            qtd_ingressos = VALUES(qtd_ingressos), valor = VALUES(valor),
            forma_pagamento = VALUES(forma_pagamento), status = VALUES(status);
        `, [
          o.id, o.pedido, o.cliente, o.evento, o.qtdIngressos || 1, o.valor || 0,
          o.formaPagamento, o.status,
          o.timestamp ? new Date(o.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    // 6. Payments
    if (Array.isArray(data.payments)) {
      for (const p of data.payments) {
        await connection.query(`
          INSERT INTO \`payments\` (id, pedido, gateway, adquirente, status, nsu, tid, parcelas, valor, taxa_gateway, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            pedido = VALUES(pedido), gateway = VALUES(gateway), adquirente = VALUES(adquirente),
            status = VALUES(status), nsu = VALUES(nsu), tid = VALUES(tid),
            parcelas = VALUES(parcelas), valor = VALUES(valor), taxa_gateway = VALUES(taxa_gateway);
        `, [
          p.id, p.pedido, p.gateway, p.adquirente, p.status, p.nsu, p.tid,
          p.parcelas || 1, p.valor || 0, p.taxaGateway || 0,
          p.timestamp ? new Date(p.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    // 7. Repasses
    if (Array.isArray(data.repasses)) {
      for (const r of data.repasses) {
        await connection.query(`
          INSERT INTO repasses (id, evento_id, evento_nome, produtor, valor, status, conta_destino, data_solicitacao, data_pagamento, comprovante)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            evento_id = VALUES(evento_id), evento_nome = VALUES(evento_nome), produtor = VALUES(produtor),
            valor = VALUES(valor), status = VALUES(status), conta_destino = VALUES(conta_destino),
            data_solicitacao = VALUES(data_solicitacao), data_pagamento = VALUES(data_pagamento),
            comprovante = VALUES(comprovante);
        `, [
          r.id, r.eventoId, r.eventoNome, r.produtor, r.valor || 0, r.status,
          r.contaDestino, r.dataSolicitacao, r.dataPagamento, r.comprovante
        ]);
      }
    }

    // 8. Logs
    if (Array.isArray(data.logs)) {
      for (const l of data.logs) {
        await connection.query(`
          INSERT IGNORE INTO logs (id, message, type, created_at)
          VALUES (?, ?, ?, ?)
        `, [
          l.id, l.message, l.type || 'system',
          l.timestamp ? new Date(l.timestamp).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]);
      }
    }

    await connection.commit();
    console.log('Migration from database.json to MySQL completed successfully!');
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error('MySQL Migration failed:', err);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
  initSchema,
  migrateFromJson
};
