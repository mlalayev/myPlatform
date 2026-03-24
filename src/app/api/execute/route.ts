import { NextRequest, NextResponse } from "next/server";
import { codeRunners, isLanguageSupported } from "@/lib/codeRunners";

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const { language, code } = await request.json();

    // Validate input
    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required" },
        { status: 400 }
      );
    }

    const lang = language.toLowerCase();

    // Check if language is supported - O(1) lookup
    if (!isLanguageSupported(lang)) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    // Execute code using the appropriate runner - O(1) lookup
    const { stdout, stderr } = await codeRunners[lang](code);

    return NextResponse.json(
      {
        output: stdout.trim(),
        error: stderr.trim(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err) {
    console.error("Error executing code:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
