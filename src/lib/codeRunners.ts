import { exec } from "child_process";
import { promisify } from "util";
import { randomBytes } from "crypto";

const execAsync = promisify(exec);

// Generate unique temp directory for each execution
const generateTempDir = () => {
  return `/tmp/code_${randomBytes(8).toString("hex")}`;
};

// Docker images for each language
const images: Record<string, string> = {
  python: "python:3.11",
  python3: "python:3.11",
  cpp: "gcc:13",
  c: "gcc:13",
  java: "openjdk:17",
  php: "php:8.2-cli",
  csharp: "mcr.microsoft.com/dotnet/sdk:8.0",
  go: "golang:1.21",
  rust: "rust:1.72",
  typescript: "node:18",
};

// Python runner
const pythonRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Clean Python code (remove comments and trailing whitespace)
    const cleanCode = code
      .replace(/\n\s*#.*$/gm, "")
      .replace(/\s+$/, "")
      .trim();

    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(cleanCode).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.python,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.py && python ${tempDir}/main.py"`,
    ].join(" ");

    console.log(`[pythonRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// C++ runner - using base64 encoding
const cppRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.cpp,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.cpp && g++ ${tempDir}/main.cpp -o ${tempDir}/a.out && chmod +x ${tempDir}/a.out && ${tempDir}/a.out"`,
    ].join(" ");

    console.log(`[cppRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// C runner - using base64 encoding
const cRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.c,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.c && gcc ${tempDir}/main.c -o ${tempDir}/a.out && chmod +x ${tempDir}/a.out && ${tempDir}/a.out"`,
    ].join(" ");

    console.log(`[cRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// Java runner - using base64 encoding
const javaRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.java,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/Main.java && javac -encoding UTF-8 ${tempDir}/Main.java && java -cp ${tempDir} Main"`,
    ].join(" ");

    console.log(`[javaRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// PHP runner - using base64 encoding for consistency
const phpRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.php,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.php && php ${tempDir}/main.php"`,
    ].join(" ");

    console.log(`[phpRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// C# runner with output filtering and base64 encoding
const csharpRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.csharp,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/Program.cs && dotnet new console -o ${tempDir}/app --force && cp ${tempDir}/Program.cs ${tempDir}/app/Program.cs && cd ${tempDir}/app && dotnet run"`,
    ].join(" ");

    console.log(`[csharpRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    // Filter dotnet status messages
    const filterPrefixes = [
      "The template ",
      "Processing post-creation actions",
      "Restoring ",
      "Restore succeeded",
      "Determining projects to restore",
      "All projects are up-to-date for restore",
      "Restore completed",
      "To learn more",
      "Getting ready",
      "Welcome to .NET",
      "More information: ",
      "Build succeeded.",
      "Build started...",
      "Build completed...",
      "You can invoke the tool",
      "info: ",
      "warn: ",
      "dbug: ",
      "fail: ",
      "error: ",
      "Time Elapsed",
      "Microsoft (R) Build Engine",
      "Copyright (C)",
      "For more information",
      "Use 'dotnet new --help'",
      "Use 'dotnet run --help'",
      "Use 'dotnet build --help'",
      "Use 'dotnet restore --help'",
      "Use 'dotnet publish --help'",
      "Use 'dotnet test --help'",
      "Restored ",
    ];

    const filteredOutput = stdout
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.length > 0 && !filterPrefixes.some((prefix) => l.startsWith(prefix))
      )
      .join("\n");

    return { stdout: filteredOutput, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// Go runner
const goRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.go,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.go && go run ${tempDir}/main.go"`,
    ].join(" ");

    console.log(`[goRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// Rust runner
const rustRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.rust,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.rs && rustc ${tempDir}/main.rs -o ${tempDir}/a.out && ${tempDir}/a.out"`,
    ].join(" ");

    console.log(`[rustRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// TypeScript runner - compiles to JavaScript and executes
const typescriptRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // Use base64 encoding to avoid shell escaping issues
    const base64Code = Buffer.from(code).toString("base64");
    const tempDir = generateTempDir();
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.typescript,
      "sh -c",
      `"mkdir -p ${tempDir} && echo '${base64Code}' | base64 -d > ${tempDir}/main.ts && npx --yes typescript@latest ${tempDir}/main.ts --target es2020 --module commonjs --outDir ${tempDir} --skipLibCheck --noEmitOnError && node ${tempDir}/main.js"`,
    ].join(" ");

    console.log(`[typescriptRunner] executing: ${dockerCmd}`);
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 30000 });

    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
};

// Main runners object - O(1) lookup
export const codeRunners: Record<
  string,
  (code: string) => Promise<{ stdout: string; stderr: string }>
> = {
  python: pythonRunner,
  python3: pythonRunner,
  cpp: cppRunner,
  c: cRunner,
  java: javaRunner,
  php: phpRunner,
  csharp: csharpRunner,
  go: goRunner,
  rust: rustRunner,
  typescript: typescriptRunner,
};

// Helper function to check if language is supported
export const isLanguageSupported = (language: string): boolean => {
  return language.toLowerCase() in codeRunners;
};
