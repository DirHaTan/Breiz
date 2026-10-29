import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqChatCompletion(promptText: string, systemPrompt?: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful AI assistant supporting a trilingual news and cultural publication in Breton (Skolveurieg orthography), French, and English. Never use the 'zh' digraph in Breton text; prefer Skolveurieg forms.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error connecting to Groq:", error);
    throw error;
  }
}

export async function summarizeContent(text: string, language: "br" | "fr" | "en" = "br") {
  const langNames = { br: "Breton (Skolveurieg)", fr: "French", en: "English" };
  const prompt = `Summarize the following article in ${langNames[language]}, in 2-3 concise sentences. Keep the summary faithful and neutral.\n\n${text}`;
  return getGroqChatCompletion(prompt);
}

export async function translateContent(text: string, from: string, to: string) {
  const prompt = `Translate the following text from ${from} to ${to}. For Breton, strictly use Skolveurieg orthography (no 'zh'). Preserve meaning and tone.\n\n${text}`;
  return getGroqChatCompletion(prompt);
}
