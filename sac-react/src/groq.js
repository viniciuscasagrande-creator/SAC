import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Apenas para testes no navegador
});

export async function perguntarIA(texto) {
  const resposta = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: texto,
      },
    ],
  });
  return resposta.choices[0].message.content;
}
