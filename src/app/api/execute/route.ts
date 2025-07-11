import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import { randomBytes } from "crypto";

const execAsync = promisify(exec);

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

const commands: Record<string, (filename: string) => string> = {
  python: (filename: string) => `python /code/${filename}`,
  python3: (filename: string) => `python /code/${filename}`,
  cpp: (filename: string) => `g++ /code/${filename} -o /code/a.out && /code/a.out`,
  c: (filename: string) => `gcc /code/${filename} -o /code/a.out && /code/a.out`,
  java: (filename: string) => `javac /code/${filename} && java -cp /code Main`,
  php: (filename: string) => `php /code/${filename}`,
  csharp: (filename: string) => `dotnet new console -o /code/app --force && mv /code/${filename} /code/app/Program.cs && dotnet run --project /code/app`,
  go: (filename: string) => `go run /code/${filename}`,
  rust: (filename: string) => `rustc /code/${filename} -o /code/a.out && /code/a.out`,
};

async function runInSandbox(language: string, code: string) {
  const image = images[language];
  if (!image) throw new Error("Unsupported language");
  const filename = filenames[language];
  const tmpDir = `/tmp/sandbox_${randomBytes(6).toString("hex")}`;
  await fs.promises.mkdir(tmpDir, { recursive: true });
  await fs.promises.writeFile(`${tmpDir}/${filename}`, code, { encoding: "utf8" });
  const dockerCmd = [
    "docker run --rm",
    "--network none",
    "--memory=256m --cpus=0.5",
    `-v ${tmpDir}:/code`,
    image,
    "/bin/sh -c",
    `'${commands[language](filename)}'`
  ].join(" ");
  let stdout = "", stderr = "";
  try {
    const { stdout: out, stderr: err } = await execAsync(dockerCmd, { timeout: 15000 });
    stdout = out;
    stderr = err;
  } catch (e: unknown) {
    stderr = (e as Error).message;
    stdout = (e as Error).message;
  }
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
  return { stdout, stderr };
}

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
    if (!images[lang]) {
      return NextResponse.json(
        {
          error:
            "Only Python, C, C++, C#, Java, PHP, Go, Rust are supported in this runner.",
        },
        { status: 400 }
      );
    }
    let output = "";
    let error = "";
    const { stdout, stderr } = await runInSandbox(lang, code);
    output = stdout.trim();
    error = stderr.trim();
    return NextResponse.json({
      output,
      error,
      exitCode: 0, // Placeholder, actual exit code would need to be captured from the process
      language: lang,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
