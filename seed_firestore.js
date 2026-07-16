const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Admin SDK inicializado para Carga de Dados (Seeding)...");
  const db = admin.firestore();

  const mockData = {
    saldos: [
      {
        eventoId: "evt-1",
        evento: "Show Roupa Nova",
        receitaBruta: 120500.00,
        taxas: 12050.00,
        liquido: 108450.00,
        disponivel: 80000.00,
        bloqueado: 28450.00,
        liberarEm: "2026-07-20"
      },
      {
        eventoId: "evt-2",
        evento: "Samba 90 Graus",
        receitaBruta: 85000.00,
        taxas: 8500.00,
        liquido: 76500.00,
        disponivel: 76500.00,
        bloqueado: 0.00,
        liberarEm: "Imediato"
      }
    ],
    repasses: [
      {
        eventoId: "evt-2",
        valor: 50000.00,
        status: "Concluído",
        contaDestino: "Banco do Brasil (Ag: 1234, CC: 56789-0)",
        dataSolicitacao: "10/07/2025",
        dataPagamento: "11/07/2025"
      },
      {
        eventoId: "evt-2",
        valor: 26500.00,
        status: "Pendente",
        contaDestino: "Banco do Brasil (Ag: 1234, CC: 56789-0)",
        dataSolicitacao: "15/07/2025",
        dataPagamento: "-"
      }
    ],
    antecipacoes: [
      {
        eventoId: "evt-1",
        valor: 30000.00,
        taxa: 4.50,
        status: "Aprovado"
      },
      {
        eventoId: "evt-1",
        valor: 15000.00,
        taxa: 4.50,
        status: "Pendente"
      }
    ],
    extrato: [
      {
        eventoId: "evt-1",
        tipo: "Receita",
        descricao: "Venda de Ingresso Lote 1",
        valor: 580.00,
        data: "16/07/2026 09:12"
      },
      {
        eventoId: "evt-1",
        tipo: "Despesa",
        descricao: "Aluguel de Palco & Som",
        valor: -15000.00,
        data: "10/07/2026 14:00"
      },
      {
        eventoId: "evt-2",
        tipo: "Repasse",
        descricao: "Transferência de Repasse Efetuada",
        valor: -50000.00,
        data: "11/07/2025 10:00"
      }
    ],
    despesas: [
      {
        eventoId: "evt-1",
        descricao: "Aluguel de Palco & Som",
        categoria: "Produção",
        valor: 15000.00,
        fornecedor: "Som & Luz Sul Ltda",
        data: "10/07/2026"
      },
      {
        eventoId: "evt-1",
        descricao: "Taxa Ecad Licença",
        categoria: "Taxas Fiscais",
        valor: 3500.00,
        fornecedor: "ECAD Regional Sul",
        data: "12/07/2026"
      }
    ],
    contas: [
      {
        banco: "Banco do Brasil",
        agencia: "1234-5",
        conta: "56789-0",
        titular: "Teatro Positivo Produções Ltda",
        pix: "00.000.000/0001-00"
      }
    ]
  };

  async function seed() {
    for (const collectionName of Object.keys(mockData)) {
      console.log(`Carregando coleção '${collectionName}'...`);
      const colRef = db.collection(collectionName);
      
      // Clear existing records if needed, then insert
      const snapshot = await colRef.get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      for (const item of mockData[collectionName]) {
        await colRef.add({
          ...item,
          userId: "usuario_organizador_demo_1", // Default UID for rules matching demo
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      console.log(`✔ Coleção '${collectionName}' populada.`);
    }
    console.log("Carga de dados de teste finalizada com sucesso!");
    process.exit(0);
  }

  seed();

} catch (error) {
  console.error("Erro na carga de dados (Seeding):", error);
  process.exit(1);
}
