import { NextRequest, NextResponse } from "next/server";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execAsync = promisify(exec);

// WebAssembly-based execution configuration
const wasmConfigs = {
  python: {
    runtime: "pyodide",
    url: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js",
  },
  cpp: {
    runtime: "emscripten",
    url: "https://cdn.jsdelivr.net/npm/@emscripten/compiler@3.1.45/compiler.js",
  },
  javascript: {
    runtime: "native",
    execute: "eval",
  },
  typescript: {
    runtime: "native",
    execute: "eval",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();
    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }
    const lang = language.toLowerCase();
    if (
      lang !== "python" &&
      lang !== "python3" &&
      lang !== "cpp" &&
      lang !== "c" &&
      lang !== "csharp" &&
      lang !== "java" &&
      lang !== "php"
    ) {
      return NextResponse.json(
        {
          error:
            "Only Python, C, C++, C#, Java, and PHP are supported in this runner.",
        },
        { status: 400 }
      );
    }

    // Auto-detect user language from referer URL
    const referer = request.headers.get("referer") || "";
    let userLang = "en"; // default to English

    // Extract language from URL path like /az/, /ru/, /en/
    const langMatch = referer.match(/\/(az|ru|en)\//);
    if (langMatch) {
      userLang = langMatch[1];
    }

    let output = "";
    let error = "";
    let exitCode = 0;

    if (lang === "python" || lang === "python3") {
      // Create a temporary file for the code
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "pycode-")
      );
      const filePath = path.join(tmpDir, "main.py");
      await fs.promises.writeFile(filePath, code);

      try {
        // Run the code with a timeout (3 seconds) and force UTF-8 encoding, using safe_runner.py
        const safeRunnerPath = path.join(
          process.cwd(),
          "src/app/api/execute/safe_runner.py"
        );
        const pythonProcess = spawn("python", ["-X", "utf8", safeRunnerPath], {
          env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        });

        // Pipe user code to stdin
        const codeStr = await fs.promises.readFile(filePath, "utf-8");
        pythonProcess.stdin.write(codeStr);
        pythonProcess.stdin.end();

        // Capture output
        let stdout = "";
        let stderr = "";
        pythonProcess.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        pythonProcess.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        // Handle timeout
        const timeout = setTimeout(() => {
          error = "Execution timed out.";
          pythonProcess.kill("SIGKILL");
        }, 3000);

        await new Promise((resolve) => {
          pythonProcess.on("close", (code) => {
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
    } else if (lang === "cpp") {
      // Use local C++ execution with MSYS2 and g++
      try {
        const safeRunnerPath = path.join(
          process.cwd(),
          "src/app/api/execute/safe_cpp_runner.py"
        );
        const cppProcess = spawn("python", [safeRunnerPath], {
          env: {
            ...process.env,
            USER_LANG: userLang,
            PYTHONIOENCODING: "utf-8",
          },
        });

        // Pipe user code to stdin
        cppProcess.stdin.write(code);
        cppProcess.stdin.end();

        // Capture output
        let stdout = "";
        let stderr = "";
        cppProcess.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        cppProcess.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        // Handle timeout
        const timeout = setTimeout(() => {
          error = "Execution timed out.";
          cppProcess.kill("SIGKILL");
        }, 10000); // 10 seconds for C++ compilation and execution

        await new Promise((resolve) => {
          cppProcess.on("close", (code) => {
            clearTimeout(timeout);
            output = stdout;
            error = error || stderr;
            exitCode = code || 0;
            resolve(null);
          });
        });
      } catch (err: any) {
        error = "Server error: " + err.message;
        exitCode = 1;
      }
    } else if (lang === "c") {
      // C code execution
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "ccode-")
      );
      const filePath = path.join(tmpDir, "main.c");
      const exePath = path.join(
        tmpDir,
        process.platform === "win32" ? "main.exe" : "main"
      );

      // Faylı UTF-8 ilə yaz
      await fs.promises.writeFile(filePath, code, { encoding: "utf8" });

      try {
        // GCC yollarını yoxla
        const possibleGccPaths = [
          "gcc",
          "C:\\msys64\\mingw64\\bin\\gcc.exe",
          "C:\\mingw64\\bin\\gcc.exe",
          "C:\\TDM-GCC-64\\bin\\gcc.exe",
          "C:\\Program Files\\mingw-w64\\x86_64-8.1.0-posix-seh-rt_v6-rev0\\mingw64\\bin\\gcc.exe",
        ];

        let gccPath = "";

        // Windows üçün GCC tap
        if (process.platform === "win32") {
          for (const path of possibleGccPaths) {
            try {
              await execAsync(`"${path}" --version`, { timeout: 2000 });
              gccPath = path;
              break;
            } catch (err) {
              continue;
            }
          }
        } else {
          gccPath = "gcc";
        }

        if (!gccPath) {
          throw new Error(
            "GCC compiler not found. Please install MinGW or TDM-GCC."
          );
        }

        console.log(`Using GCC: ${gccPath}`);

        // Compile C code
        const compileCmd = `"${gccPath}" -finput-charset=UTF-8 -fexec-charset=UTF-8 "${filePath}" -o "${exePath}"`;

        await execAsync(compileCmd, {
          cwd: tmpDir,
          env: {
            ...process.env,
            PATH:
              process.platform === "win32"
                ? `C:\\msys64\\mingw64\\bin;${process.env.PATH}`
                : process.env.PATH,
            LC_ALL: "en_US.UTF-8",
            LANG: "en_US.UTF-8",
          },
        });

        console.log("Compilation successful");

        // Run compiled program
        const { stdout, stderr } = await execAsync(`"${exePath}"`, {
          cwd: tmpDir,
          timeout: 5000,
          env: {
            ...process.env,
            LC_ALL: "en_US.UTF-8",
            LANG: "en_US.UTF-8",
          },
          encoding: "utf8",
        });

        output = stdout;
        error = stderr;
      } catch (err: any) {
        console.log("C compile/run error:", err);
        error = err.stderr || err.message;
        output = err.stdout || "";
        exitCode = 1;
      }

      // Temp qovluğu sil
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } else if (lang === "csharp") {
      // C# code execution
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "cscode-")
      );
      const filePath = path.join(tmpDir, "Program.cs");
      await fs.promises.writeFile(filePath, code);
      try {
        // Compile and run using dotnet CLI
        await execAsync(`dotnet new console -o "${tmpDir}" --force`);
        await fs.promises.writeFile(path.join(tmpDir, "Program.cs"), code);
        const { stdout, stderr } = await execAsync(
          `dotnet run --project "${tmpDir}"`
        );
        output = stdout;
        error = stderr;
      } catch (err: any) {
        error = err.stderr || err.message;
        output = err.stdout || "";
        exitCode = 1;
      }
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } else if (lang === "java") {
      // Java code execution
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "javacode-")
      );
      const filePath = path.join(tmpDir, "Main.java");

      // Faylı UTF-8 ilə yaz (BOM olmadan)
      await fs.promises.writeFile(filePath, code, { encoding: "utf8" });

      try {
        // Compile zamanı UTF-8 istifadə et
        const compileCmd =
          process.platform === "win32"
            ? `chcp 65001 >NUL && javac -encoding UTF-8 "${filePath}"`
            : `javac -encoding UTF-8 "${filePath}"`;

        await execAsync(compileCmd, {
          cwd: tmpDir,
          env: { ...process.env, JAVA_TOOL_OPTIONS: "-Dfile.encoding=UTF-8" },
        });

        // Run zamanı UTF-8 parametrlərini əlavə et
        const javaCmd =
          process.platform === "win32"
            ? `chcp 65001 >NUL && java -Dfile.encoding=UTF-8 -Dconsole.encoding=UTF-8 -Dstdout.encoding=UTF-8 -cp "${tmpDir}" Main`
            : `java -Dfile.encoding=UTF-8 -Dconsole.encoding=UTF-8 -Dstdout.encoding=UTF-8 -cp "${tmpDir}" Main`;

        const { stdout, stderr } = await execAsync(javaCmd, {
          cwd: tmpDir,
          timeout: 5000,
          env: {
            ...process.env,
            JAVA_TOOL_OPTIONS: "-Dfile.encoding=UTF-8",
            LC_ALL: "en_US.UTF-8",
            LANG: "en_US.UTF-8",
          },
          encoding: "utf8",
        });

        // JAVA_TOOL_OPTIONS mesajını təmizlə
        output = stdout.replace(/^Picked up JAVA_TOOL_OPTIONS:.*\n?/gm, "");
        error = stderr.replace(/^Picked up JAVA_TOOL_OPTIONS:.*\n?/gm, "");
      } catch (err: any) {
        console.log("Java compile/run error:", err);
        error = err.stderr || err.message;
        output = err.stdout || "";
        exitCode = 1;
      }

      // Temp qovluğu sil
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } else if (lang === "php") {
      // PHP yolu
      const phpPath = "C:\\php\\php.exe";
      
      // PHP mövcudluğunu yoxla
      try {
        await execAsync(`"${phpPath}" --version`, { timeout: 3000 });
      } catch (error) {
        return NextResponse.json(
          { error: `PHP not found at ${phpPath}. Please check if PHP is installed correctly.` },
          { status: 500 }
        );
      }
    
      // PHP code execution
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "phpcode-")
      );
      const filePath = path.join(tmpDir, "main.php");
      
      try {
        await fs.promises.writeFile(filePath, code, { encoding: "utf8" });
        
        // Run the PHP code with specific PHP path
        const phpProcess = spawn(phpPath, [filePath], {
          env: { 
            ...process.env,
            LC_ALL: "en_US.UTF-8",
            LANG: "en_US.UTF-8"
          },
        });
    
        let stdout = "";
        let stderr = "";
        let isTimedOut = false;
        let processExited = false;
    
        phpProcess.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        
        phpProcess.stderr.on("data", (data) => {
          stderr += data.toString();
        });
    
        // Handle timeout
        const timeout = setTimeout(() => {
          if (!processExited) {
            isTimedOut = true;
            error = "Execution timed out.";
            phpProcess.kill("SIGKILL");
          }
        }, 3000);
    
        await new Promise<void>((resolve) => {
          phpProcess.on("close", (code) => {
            processExited = true;
            clearTimeout(timeout);
            
            if (!isTimedOut) {
              output = stdout;
              error = error || stderr;
              exitCode = code || 0;
            }
            resolve();
          });
          
          phpProcess.on("error", (err) => {
            processExited = true;
            clearTimeout(timeout);
            error = `Process error: ${err.message}`;
            exitCode = 1;
            resolve();
          });
        });
        
      } catch (err: any) {
        error = err.stderr || err.message || "Unknown error occurred";
        output = err.stdout || "";
        exitCode = 1;
      } finally {
        // Clean up
        try {
          await fs.promises.rm(tmpDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.warn("Failed to cleanup temp directory:", cleanupErr);
        }
      }
    }

    return NextResponse.json({
      output: output.trim(),
      error: error.trim(),
      exitCode,
      language: lang,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
