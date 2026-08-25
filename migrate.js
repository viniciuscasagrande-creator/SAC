const { testConnection, migrateFromJson } = require('./postgres');

async function run() {
  console.log('--- Iniciando Verificação de Conexão com o PostgreSQL ---');
  const status = await testConnection();

  if (!status.connected) {
    console.error('❌ Não foi possível conectar ao PostgreSQL:');
    console.error('Detalhes do erro:', status.error);
    console.log('\nVerifique se:');
    console.log('1. O serviço do PostgreSQL está em execução na porta 5432.');
    console.log('2. As variáveis de ambiente (PGUSER, PGPASSWORD, PGDATABASE) ou DATABASE_URL estão corretas no .env.');
    process.exit(1);
  }

  console.log(`✅ Conectado com sucesso ao banco: "${status.database}"`);
  console.log(`⏰ Horário do Servidor: ${status.time}`);
  console.log('\n--- Iniciando Migração de Dados (database.json -> PostgreSQL) ---');

  try {
    await migrateFromJson();
    console.log('🎉 Migração finalizada com sucesso! Todas as tabelas e dados foram sincronizados.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante a migração:', err.message);
    process.exit(1);
  }
}

run();
