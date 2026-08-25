const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'sac_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Test connection
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}

// Initialize tables from schema.sql
async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('schema.sql not found');
  }
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('PostgreSQL schema initialized successfully.');
}

// Migrate data from database.json into PostgreSQL
async function migrateFromJson() {
  const jsonPath = path.join(__dirname, 'database.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error('database.json not found');
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  await initSchema();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Tickets
    if (Array.isArray(data.tickets)) {
      for (const t of data.tickets) {
        await client.query(`
          INSERT INTO tickets (id, title, category, subcategory, module, client, cpf, description, sla, priority, queue, status, bypass, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title, category = EXCLUDED.category, subcategory = EXCLUDED.subcategory,
            module = EXCLUDED.module, client = EXCLUDED.client, cpf = EXCLUDED.cpf,
            description = EXCLUDED.description, sla = EXCLUDED.sla, priority = EXCLUDED.priority,
            queue = EXCLUDED.queue, status = EXCLUDED.status, bypass = EXCLUDED.bypass;
        `, [t.id, t.title, t.category, t.subcategory, t.module, t.client, t.cpf, t.description, t.sla, t.priority, t.queue, t.status, !!t.bypass, t.timestamp || new Date()]);
      }
    }

    // 2. Estornos
    if (Array.isArray(data.estornos)) {
      for (const e of data.estornos) {
        await client.query(`
          INSERT INTO estornos (id, order_id, client, show, value, gateway, net_refund, status, motivo, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            order_id = EXCLUDED.order_id, client = EXCLUDED.client, show = EXCLUDED.show,
            value = EXCLUDED.value, gateway = EXCLUDED.gateway, net_refund = EXCLUDED.net_refund,
            status = EXCLUDED.status, motivo = EXCLUDED.motivo;
        `, [e.id, e.order, e.client, e.show, e.value, e.gateway, e.netRefund, e.status, e.motivo, e.timestamp || new Date()]);
      }
    }

    // 3. Clientes
    if (Array.isArray(data.clientes)) {
      for (const c of data.clientes) {
        await client.query(`
          INSERT INTO clientes (id, nome, cpf, email, telefone, cidade, nivel, total_compras, pedidos_realizados, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            nome = EXCLUDED.nome, cpf = EXCLUDED.cpf, email = EXCLUDED.email,
            telefone = EXCLUDED.telefone, cidade = EXCLUDED.cidade, nivel = EXCLUDED.nivel,
            total_compras = EXCLUDED.total_compras, pedidos_realizados = EXCLUDED.pedidos_realizados,
            status = EXCLUDED.status;
        `, [c.id, c.nome, c.cpf, c.email, c.telefone, c.cidade, c.nivel, c.totalCompras, c.pedidosRealizados, c.status, c.timestamp || new Date()]);
      }
    }

    // 4. Eventos
    if (Array.isArray(data.eventos)) {
      for (const ev of data.eventos) {
        await client.query(`
          INSERT INTO eventos (id, nome, produtor, local, data, capacidade, ingressos_vendidos, receita_bruta, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            nome = EXCLUDED.nome, produtor = EXCLUDED.produtor, local = EXCLUDED.local,
            data = EXCLUDED.data, capacidade = EXCLUDED.capacidade,
            ingressos_vendidos = EXCLUDED.ingressos_vendidos, receita_bruta = EXCLUDED.receita_bruta,
            status = EXCLUDED.status;
        `, [ev.id, ev.nome, ev.produtor, ev.local, ev.data, ev.capacidade, ev.ingressosVendidos, ev.receitaBruta, ev.status]);
      }
    }

    // 5. Orders
    if (Array.isArray(data.orders)) {
      for (const o of data.orders) {
        await client.query(`
          INSERT INTO orders (id, pedido, cliente, evento, qtd_ingressos, valor, forma_pagamento, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            pedido = EXCLUDED.pedido, cliente = EXCLUDED.cliente, evento = EXCLUDED.evento,
            qtd_ingressos = EXCLUDED.qtd_ingressos, valor = EXCLUDED.valor,
            forma_pagamento = EXCLUDED.forma_pagamento, status = EXCLUDED.status;
        `, [o.id, o.pedido, o.cliente, o.evento, o.qtdIngressos, o.valor, o.formaPagamento, o.status, o.timestamp || new Date()]);
      }
    }

    // 6. Payments
    if (Array.isArray(data.payments)) {
      for (const p of data.payments) {
        await client.query(`
          INSERT INTO payments (id, pedido, gateway, adquirente, status, nsu, tid, parcelas, valor, taxa_gateway, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            pedido = EXCLUDED.pedido, gateway = EXCLUDED.gateway, adquirente = EXCLUDED.adquirente,
            status = EXCLUDED.status, nsu = EXCLUDED.nsu, tid = EXCLUDED.tid,
            parcelas = EXCLUDED.parcelas, valor = EXCLUDED.valor, taxa_gateway = EXCLUDED.taxa_gateway;
        `, [p.id, p.pedido, p.gateway, p.adquirente, p.status, p.nsu, p.tid, p.parcelas, p.valor, p.taxaGateway, p.timestamp || new Date()]);
      }
    }

    // 7. Repasses
    if (Array.isArray(data.repasses)) {
      for (const r of data.repasses) {
        await client.query(`
          INSERT INTO repasses (id, evento_id, evento_nome, produtor, valor, status, conta_destino, data_solicitacao, data_pagamento, comprovante)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            evento_id = EXCLUDED.evento_id, evento_nome = EXCLUDED.evento_nome, produtor = EXCLUDED.produtor,
            valor = EXCLUDED.valor, status = EXCLUDED.status, conta_destino = EXCLUDED.conta_destino,
            data_solicitacao = EXCLUDED.data_solicitacao, data_pagamento = EXCLUDED.data_pagamento,
            comprovante = EXCLUDED.comprovante;
        `, [r.id, r.eventoId, r.eventoNome, r.produtor, r.valor, r.status, r.contaDestino, r.dataSolicitacao, r.dataPagamento, r.comprovante]);
      }
    }

    // 8. Logs
    if (Array.isArray(data.logs)) {
      for (const l of data.logs) {
        await client.query(`
          INSERT INTO logs (id, message, type, created_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;
        `, [l.id, l.message, l.type || 'system', l.timestamp || new Date()]);
      }
    }

    await client.query('COMMIT');
    console.log('Migration from database.json to PostgreSQL completed successfully!');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
  initSchema,
  migrateFromJson
};
