// sac-react/src/groq.js
// Client-side API adapter communicating with our secure Node.js backend.
// Uses relative paths to support unified single-port hosting.

const getApiUrl = () => {
  return "/api/ask-groq";
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
