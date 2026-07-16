import Groq from "groq-sdk";

// Initialize Groq client. It automatically loads GROQ_API_KEY from the environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function main() {
  console.log("Iniciando chamada de teste para a API da Groq...");
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Olá! Confirme que você está ativo e responda com uma frase motivacional curta sobre inteligência artificial.",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log("\n--- Resposta da Groq ---");
    console.log(chatCompletion.choices[0]?.message?.content || "Nenhuma resposta retornada.");
    console.log("------------------------");
  } catch (error) {
    console.error("Erro na comunicação com a API da Groq:", error);
  }
}

main();
