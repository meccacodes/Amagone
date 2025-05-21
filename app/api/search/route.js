import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, model, options } = await request.json();
    console.log("Incoming request body:", { messages, model, options });

    const API_KEY = process.env.PERPLEXITY_API_KEY;
    if (!API_KEY) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    const API_URL = "https://api.perplexity.ai/chat/completions";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Perplexity API:", errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/search:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
