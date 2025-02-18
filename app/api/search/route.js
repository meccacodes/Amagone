import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, model, options } = await request.json();
    console.log("Incoming request body:", { messages, model, options });

    const API_KEY = process.env.PERPLEXITY_API_KEY;
    console.log("API Key:", API_KEY);
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

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Perplexity API:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/search:", error);
    console.error("Full error details:", error.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
