import { NextRequest, NextResponse } from 'next/server';

// WebAssembly-based execution configuration
const wasmConfigs = {
  python: {
    runtime: 'pyodide',
    url: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
  },
  javascript: {
    runtime: 'native',
    execute: 'eval'
  },
  typescript: {
    runtime: 'native',
    execute: 'eval'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();
    
    // Input validation
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Security: Limit code size
    if (code.length > 10000) {
      return NextResponse.json(
        { error: 'Code too large (max 10KB)' },
        { status: 400 }
      );
    }

    // For JavaScript/TypeScript, we can execute directly
    if (language === 'javascript' || language === 'typescript') {
      try {
        let output = '';
        let error = '';
        const startTime = Date.now();

        // Capture console.log output
        const originalLog = console.log;
        const logs: string[] = [];
        console.log = (...args: any[]) => {
          logs.push(args.map(String).join(" "));
          originalLog(...args);
        };

        // Execute the code
        const result = eval(code);
        const executionTime = Date.now() - startTime;

        // Restore console.log
        console.log = originalLog;

        output = logs.length > 0 ? logs.join("\n") : String(result);

        return NextResponse.json({
          output: output.trim(),
          error: error.trim(),
          executionTime,
          language,
          runtime: 'native'
        });
      } catch (err: any) {
        return NextResponse.json({
          output: '',
          error: err.message,
          executionTime: 0,
          language,
          runtime: 'native'
        });
      }
    }

    // For other languages, return instructions for client-side execution
    return NextResponse.json({
      output: '',
      error: `Language ${language} requires client-side execution. Please use the built-in executor.`,
      executionTime: 0,
      language,
      runtime: 'client-side'
    });

  } catch (error: any) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 