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
    const lang = language.toLowerCase();
    if (lang !== 'python' && lang !== 'python3' && lang !== 'cpp') {
      return NextResponse.json({ error: 'Only Python and C++ are supported in this runner.' }, { status: 400 });
    }

    // Auto-detect user language from referer URL
    const referer = request.headers.get('referer') || '';
    let userLang = 'en'; // default to English
    
    // Extract language from URL path like /az/, /ru/, /en/
    const langMatch = referer.match(/\/(az|ru|en)\//);
    if (langMatch) {
      userLang = langMatch[1];
    }

    let output = '';
    let error = '';
    let exitCode = 0;

    if (lang === 'python' || lang === 'python3') {
      // Create a temporary file for the code
      const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'pycode-'));
      const filePath = path.join(tmpDir, 'main.py');
      await fs.promises.writeFile(filePath, code);

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
    } else if (lang === 'cpp') {
      try {
        // Try local compilation first
        const safeRunnerPath = path.join(process.cwd(), 'src/app/api/execute/safe_cpp_runner.py');
        const cppProcess = spawn('python', [safeRunnerPath], {
          env: { 
            ...process.env,
            PATH: process.env.PATH + ';C:\\msys64\\mingw64\\bin',
            GPP_PATH: 'C:\\msys64\\mingw64\\bin',
            USER_LANG: userLang  // Pass detected language to the runner
          },
        });

        // Pipe user code to stdin
        cppProcess.stdin.write(code);
        cppProcess.stdin.end();

        // Capture output
        let stdout = '';
        let stderr = '';
        cppProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        cppProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        // Handle timeout
        const timeout = setTimeout(() => {
          error = 'Execution timed out.';
          cppProcess.kill('SIGKILL');
        }, 8000);

                await new Promise(async (resolve) => {
          cppProcess.on('close', async (code) => {
            clearTimeout(timeout);
            output = stdout;
            error = error || stderr;
            exitCode = code || 0;
            console.log('C++ Debug:', { output, error, exitCode, stdout, stderr });
            
            // If local compilation failed, try online compiler
            if (exitCode !== 0 || error.includes('not found') || error.includes('failed')) {
              console.log('Local compilation failed, trying online compiler...');
              // Use online C++ compiler as fallback
              try {
                const onlineResponse = await fetch('https://codex-api.vercel.app/api/execute', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    code: code,
                    language: 'cpp'
                  })
                });
                
                if (onlineResponse.ok) {
                  const onlineResult = await onlineResponse.json();
                  if (onlineResult.output) {
                    output = onlineResult.output;
                    error = '';
                    exitCode = 0;
                  } else if (onlineResult.error) {
                    error = onlineResult.error;
                    exitCode = 1;
                  }
                }
              } catch (onlineErr) {
                console.log('Online compiler also failed:', onlineErr);
              }
            }
            
            resolve(null);
          });
        });
      } catch (err: any) {
        error = err.message;
        exitCode = 1;
      }
    }

    return NextResponse.json({
      output: output.trim(),
      error: error.trim(),
      exitCode,
      language: lang,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 