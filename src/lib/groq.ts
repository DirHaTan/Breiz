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

const MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
];

export async function getGroqChatCompletion(promptText: string, systemPrompt?: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt || DEFAULT_SYSTEM,
    },
    {
      role: "user" as const,
      content: promptText,
    },
  ];

  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.5,
        max_tokens: 2048,
      });

      const content = chatCompletion.choices[0]?.message?.content;
      if (content) return content;
    } catch (error) {
      lastError = error;
      const msg = error instanceof Error ? error.message : String(error);
      // Retry only on model-not-found / invalid request style errors.
      if (!/404|model_not_found|invalid_request|not found|does not exist/i.test(msg)) {
        console.error(`Groq error with model ${model}:`, error);
        throw error;
      }
      console.warn(`Model ${model} unavailable, trying next fallback…`);
    }
  }

  console.error("All Groq models failed:", lastError);
  throw lastError instanceof Error ? lastError : new Error("All Groq models failed");
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
