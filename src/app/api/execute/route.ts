import { NextRequest, NextResponse } from 'next/server';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

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
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }
    if (language.toLowerCase() !== 'python' && language.toLowerCase() !== 'python3') {
      return NextResponse.json({ error: 'Only Python is supported in this runner.' }, { status: 400 });
    }

    // Create a temporary file for the code
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pycode-'));
    const filePath = path.join(tmpDir, 'main.py');
    await fs.promises.writeFile(filePath, code);

    let output = '';
    let error = '';
    let exitCode = 0;
    try {
      // Run the code with a timeout (3 seconds) and force UTF-8 encoding, using safe_runner.py
      const safeRunnerPath = path.join(process.cwd(), 'src/app/api/execute/safe_runner.py');
      const pythonProcess = spawn('python', ['-X', 'utf8', safeRunnerPath], {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      });

      // Pipe user code to stdin
      const codeStr = await fs.promises.readFile(filePath, 'utf-8');
      pythonProcess.stdin.write(codeStr);
      pythonProcess.stdin.end();

      // Capture output
      let stdout = '';
      let stderr = '';
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Handle timeout
      const timeout = setTimeout(() => {
        error = 'Execution timed out.';
        pythonProcess.kill('SIGKILL');
      }, 3000);

      await new Promise((resolve) => {
        pythonProcess.on('close', (code) => {
          clearTimeout(timeout);
          output = stdout;
          error = error || stderr;
          exitCode = code || 0;
          resolve(null);
        });
      });
    } catch (err: any) {
      error = err.message;
      exitCode = 1;
    }

    // Clean up
    await fs.promises.rm(tmpDir, { recursive: true, force: true });

    return NextResponse.json({
      output: output.trim(),
      error: error.trim(),
      exitCode,
      language: 'python',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 