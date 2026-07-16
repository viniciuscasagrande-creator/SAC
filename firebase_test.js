const admin = require("firebase-admin");

// 1. Defina o caminho para o seu arquivo JSON de credenciais baixado do console do Firebase
const serviceAccount = require("./serviceAccountKey.json"); 

try {
    // 2. Inicializa o SDK Admin do Firebase
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Firebase Admin SDK inicializado com sucesso!");

    // Exemplo de acesso ao Firestore
    const db = admin.firestore();
    
    // Teste de leitura/gravação simples
    const testDocRef = db.collection("sac_test").doc("inicializacao");
    
    testDocRef.set({
        status: "Ativo",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        mensagem: "Integração do ERP via Admin SDK funcionando"
    }).then(() => {
        console.log("Documento de teste gravado no Firestore com sucesso!");
        process.exit(0);
    }).catch(err => {
        console.error("Erro ao gravar documento:", err);
        process.exit(1);
    });

} catch (error) {
    print("Erro durante a inicialização:", error);
}
