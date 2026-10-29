import { NextRequest, NextResponse } from "next/server";
import { summarizeContent, translateContent } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, language, from, to } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    let result: string;

    if (action === "summarize") {
      result = await summarizeContent(text, language || "br");
    } else if (action === "translate") {
      if (!from || !to) {
        return NextResponse.json({ error: "Missing from/to languages" }, { status: 400 });
      }
      result = await translateContent(text, from, to);
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'summarize' or 'translate'" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Failed to process with Groq" }, { status: 500 });
  }
}
