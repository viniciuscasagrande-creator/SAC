// sac-react/src/groq.js
// Client-side API adapter communicating with our secure Node.js backend.
// No Groq SDK imports or API Keys are exposed to the client browser bundle.

const getApiUrl = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  
  // Local development fallback
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000/api/ask-groq";
  }
  
  // Objective static Localtunnel URL
  return "https://pdtnovosacapi.loca.lt/api/ask-groq";
};

export async function perguntarIA(texto) {
  try {
    const response = await fetch(getApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto }),
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta do backend seguro: ${response.status}`);
    }

    const data = await response.json();
    return data.resposta;
  } catch (error) {
    console.error("Falha ao comunicar com o servidor de IA seguro:", error);
    throw error;
  }
}
