const { testConnection, migrateFromJson } = require('./mysql');

// Load environment variables from .env if present
const fs = require('fs');
const path = require('path');
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

async function run() {
  console.log('--- Iniciando Verificação de Conexão com o MySQL ---');
  const status = await testConnection();

  if (!status.connected) {
    console.error('❌ Não foi possível conectar ao MySQL:');
    console.error('Detalhes do erro:', status.error);
    console.log('\nVerifique se:');
    console.log('1. O serviço do MySQL está em execução (porta 3306 padrão, XAMPP, Docker ou serviço local).');
    console.log('2. O banco de dados definido (ex: "sac_db") já foi criado no MySQL (`CREATE DATABASE sac_db;`).');
    console.log('3. As variáveis de ambiente (MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE) ou MYSQL_URL estão corretas no .env.');
    process.exit(1);
  }

  console.log(`✅ Conectado com sucesso ao MySQL! Banco selecionado: "${status.database}"`);
  console.log(`⏰ Horário do Servidor MySQL: ${status.time}`);
  console.log('\n--- Iniciando Migração de Dados (database.json -> MySQL) ---');

  try {
    await migrateFromJson();
    console.log('🎉 Migração finalizada com sucesso! Todas as tabelas e dados foram sincronizados no MySQL.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante a migração para MySQL:', err.message);
    process.exit(1);
  }
}

run();
