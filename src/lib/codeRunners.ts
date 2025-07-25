import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
};

// File names for each language
const filenames: Record<string, string> = {
  python: "main.py",
  python3: "main.py",
  cpp: "main.cpp",
  c: "main.c",
  java: "Main.java",
  php: "main.php",
  csharp: "Program.cs",
  go: "main.go",
  rust: "main.rs",
};

// Base Docker command template
const createDockerCommand = (
  image: string,
  code: string,
  filename: string,
  command: string
) => {
  return [
    "docker run --rm",
    "--network none",
    "--memory=256m --cpus=0.5",
    "-i",
    image,
    "sh -c",
    `"mkdir -p /code && cat > /code/${filename} && ${command}"`,
  ].join(" ");
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
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.python,
      "sh -c",
      `"echo '${base64Code}' | base64 -d > /tmp/main.py && python /tmp/main.py"`,
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
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.cpp,
      "sh -c",
      `"echo '${base64Code}' | base64 -d > /tmp/main.cpp && g++ /tmp/main.cpp -o /tmp/a.out && chmod +x /tmp/a.out && /tmp/a.out"`,
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
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.c,
      "sh -c",
      `"echo '${base64Code}' | base64 -d > /tmp/main.c && gcc /tmp/main.c -o /tmp/a.out && chmod +x /tmp/a.out && /tmp/a.out"`,
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
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.java,
      "sh -c",
      `"echo '${base64Code}' | base64 -d > /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main"`,
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

// PHP runner - using direct execution for simple code
const phpRunner = async (
  code: string
): Promise<{ stdout: string; stderr: string }> => {
  try {
    // For simple PHP code, we can use a different approach
    const safeCode = code.replace(/"/g, '\\"').replace(/\n/g, "\\n");
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.php,
      "sh -c",
      `"echo '${safeCode}' > /tmp/main.php && php /tmp/main.php"`,
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
    const dockerCmd = [
      "docker run --rm",
      "--network none",
      "--memory=256m --cpus=0.5",
      images.csharp,
      "sh -c",
      `"echo '${base64Code}' | base64 -d > /tmp/Program.cs && appdir=/tmp/app_\\$RANDOM\\$RANDOM && dotnet new console -o \\$appdir --force && cp /tmp/Program.cs \\$appdir/Program.cs && dotnet run --project \\$appdir && rm -rf \\$appdir"`,
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
  const filename = filenames.go;

  try {
    const command = `go run /code/${filename}`;
    const dockerCmd = createDockerCommand(images.go, code, filename, command);

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
  const filename = filenames.rust;

  try {
    const command = `rustc /code/${filename} -o /code/a.out && /code/a.out`;
    const dockerCmd = createDockerCommand(images.rust, code, filename, command);

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
};

// Helper function to check if language is supported
export const isLanguageSupported = (language: string): boolean => {
  return language.toLowerCase() in codeRunners;
};
