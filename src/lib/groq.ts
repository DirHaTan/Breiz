import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_SYSTEM = `
You are a professional bilingual editor for Keleier Breiz hag ar Bed, a news and cultural website published in Breton and French.

Rules you must always follow:
- Language pair is Breton ↔ French.
- All Breton text must use Skolveurieg (Falc'huneg) orthography only.
- Never use the digraph written as z-h (write Breiz, brezoneg, yez, ezomm, ouz, etc.).
- Produce fluent, clear, journalistic prose suitable for news and cultural articles.
- Stay faithful to the original meaning and tone. Do not invent facts.
`.trim();

export async function getGroqChatCompletion(promptText: string, systemPrompt?: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt || DEFAULT_SYSTEM,
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 2048,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error connecting to Groq:", error);
    throw error;
  }
}

export async function summarizeContent(text: string, language: "br" | "fr" | "en" = "br") {
  const langNames = { br: "Breton (Skolveurieg)", fr: "French", en: "English" };
  const prompt = `Summarize the following article in ${langNames[language]}, in 2-3 concise sentences suitable as a chapô / berr-gomz. Keep it faithful and neutral.\n\n${text}`;
  return getGroqChatCompletion(prompt);
}

export async function translateContent(text: string, from: string, to: string) {
  const prompt = `Translate the following text from ${from} to ${to}.\nIf the target is Breton, strictly use Skolveurieg orthography (no z-h digraph). Preserve meaning and journalistic tone.\n\n${text}`;
  return getGroqChatCompletion(prompt);
}
