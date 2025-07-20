import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
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
  cpp: (filename: string) =>
    `g++ /code/${filename} -o /code/a.out && /code/a.out`,
  c: (filename: string) =>
    `gcc /code/${filename} -o /code/a.out && /code/a.out`,
  java: (filename: string) => `javac /code/${filename} && java -cp /code Main`,
  php: (filename: string) => `php /code/${filename}`,
  // C# üçün: hər dəfə random qovluq yaradıb, orada dotnet new, kodu ora yazıb run et, sonra qovluğu sil
  csharp: (filename: string) =>
    `appdir=/code/app_$RANDOM$RANDOM && dotnet new console -o $appdir --force && cp /code/${filename} $appdir/Program.cs && dotnet run --no-restore --no-build --project $appdir && rm -rf $appdir`,
  go: (filename: string) => `go run /code/${filename}`,
  rust: (filename: string) =>
    `rustc /code/${filename} -o /code/a.out && /code/a.out`,
};

async function runInSandbox(language: string, code: string) {
  console.log(`[runInSandbox] language: ${language}`);
  const image = images[language];
  if (!image) throw new Error("Unsupported language");
  const filename = filenames[language];
  console.log(`[runInSandbox] filename: ${filename}`);

  // Java üçün həmişə fallback yolundan istifadə et

  // ... eyni kod ...
  if (language === "php") {
    try {
      const safeCode = code.replace(/([`$"\\])/g, "\\$1").replace(/\n/g, "\\n");
      const dockerCmd = [
        "docker run --rm",
        "--network none",
        "--memory=256m --cpus=0.5",
        image,
        "/bin/sh -c",
        `'mkdir -p /code && echo "${safeCode}" > /code/main.php && php /code/main.php'`,
      ].join(" ");
      console.log(`[runInSandbox][PHP] dockerCmd: ${dockerCmd}`);
      const { stdout: out, stderr: err } = await execAsync(dockerCmd, {
        timeout: 30000,
      });
      console.log(`[runInSandbox][PHP] stdout:`, out);
      console.log(`[runInSandbox][PHP] stderr:`, err);
      return { stdout: out, stderr: err };
    } catch (e) {
      console.error(`[runInSandbox][PHP] error:`, e);
      return {
        stdout: "",
        stderr:
          "PHP code could not be written in container: " +
          (e instanceof Error ? e.message : String(e)),
      };
    }
  }

  if (language === "java") {
    console.log("JAVA FALLBACK YOLU İŞLƏYİR!!!");
    try {
      // Detect public class name
      let className = "Main";
      const match = code.match(/public\s+class\s+(\w+)/);
      if (match) {
        className = match[1];
      }
      const safeCode = code.replace(/([`$"\\])/g, "\\$1").replace(/\n/g, "\\n");
      const dockerCmd = [
        "docker run --rm",
        "--network none",
        "--memory=256m --cpus=0.5",
        image,
        "/bin/sh -c",
        `'mkdir -p /code && echo -e "${safeCode}" > /code/${className}.java && javac /code/${className}.java && java -cp /code ${className}'`
      ].join(" ");
      console.log(`[runInSandbox][JAVA] dockerCmd: ${dockerCmd}`);
      const { stdout: out, stderr: err } = await execAsync(dockerCmd, { timeout: 30000 });
      console.log(`[runInSandbox][JAVA] stdout:`, out);
      console.log(`[runInSandbox][JAVA] stderr:`, err);
      return { stdout: out, stderr: err };
    } catch (e) {
      console.error(`[runInSandbox][JAVA] error:`, e);
      return {
        stdout: "",
        stderr: "Java code could not be written in container: " + (e instanceof Error ? e.message : String(e)),
      };
    }
  }

  if (language === "csharp") {
    try {
      // Kodun sonundakı şərhləri və əlavə boşluqları sil
      const codeWithoutTrailingComments = code.replace(/\n\s*\/\/.*$/gm, '').trim();
      const safeCode = codeWithoutTrailingComments.replace(/([`$"\\])/g, "\\$1").replace(/\n/g, "\\n");
      const dockerCmd = [
        "docker run --rm",
        "--network none",
        "--memory=256m --cpus=0.5",
        image,
        "/bin/sh -c",
        `'appdir=$(mktemp -d /tmp/app_XXXXXX) && dotnet new console -o $appdir --force && cat > $appdir/Program.cs <<EOF\n${codeWithoutTrailingComments}\nEOF\ndotnet run --project $appdir && rm -rf $appdir'`
      ].join(" ");
      console.log(`[runInSandbox][CSHARP] dockerCmd: ${dockerCmd}`);
      const { stdout: out, stderr: err } = await execAsync(dockerCmd, { timeout: 30000 });
      console.log(`[runInSandbox][CSHARP] stdout:`, out);
      console.log(`[runInSandbox][CSHARP] stderr:`, err);
      // Filter out dotnet status messages (same as below)
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
        "Restore completed",
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
        "Restored ", // <-- bunu əlavə edirəm
      ];
      const lines = out.split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0 && !filterPrefixes.some(prefix => l.startsWith(prefix)));
      return { stdout: lines.join("\n"), stderr: err };
    } catch (e) {
      console.error(`[runInSandbox][CSHARP] error:`, e);
      return {
        stdout: "",
        stderr: "C# code could not be written in container: " + (e instanceof Error ? e.message : String(e)),
      };
    }
  }

  // Create temp directory in universal /tmp for Docker compatibility
  const tmpDir = path.join(
    "/tmp",
    `sandbox_${randomBytes(6).toString("hex")}`
  );
  console.log(`[runInSandbox] tmpDir: ${tmpDir}`);

  try {
    // Create temp directory
    await fs.promises.mkdir(tmpDir, { recursive: true });

    // Kodun sonundakı şərhləri və əlavə boşluqları sil (Python və digər dillər üçün)
    let codeToWrite = code;
    if (language === "python" || language === "python3") {
      codeToWrite = code
        .replace(/\n\s*#.*$/gm, '') // bütün şərhləri sil
        .replace(/\s+$/, '')        // sonda boşluqları sil
        .trim();
    }

    // Write code to file
    const filePath = path.join(tmpDir, filename);
    await fs.promises.writeFile(filePath, codeToWrite, { encoding: "utf8" });
    console.log(`[runInSandbox] code written to: ${filePath}`);

    // Verify file was created
    const fileExists = await fs.promises
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    console.log(`[runInSandbox] fileExists: ${fileExists}`);
    if (!fileExists) {
      throw new Error(`Failed to create file: ${filePath}`);
    }

    // Convert Windows path to Docker path format
    let dockerPath = tmpDir.replace(/\\/g, "/");

    // For Windows, we need to handle drive letters
    if (dockerPath.match(/^[A-Za-z]:/)) {
      // Remove drive letter and convert to Docker format
      dockerPath = dockerPath.replace(/^[A-Za-z]:/, "");
      // Add leading slash if not present
      if (!dockerPath.startsWith("/")) {
        dockerPath = "/" + dockerPath;
      }
    }

    // Try different volume mounting approaches for Windows
    let dockerCmd = "";
    let success = false;
    let stdout = "",
      stderr = "";

    // Approach 1: Direct volume mount
    try {
      dockerCmd = [
        "docker run --rm",
        "--network none",
        "--memory=256m --cpus=0.5",
        `-v \"${tmpDir}:/code\"`,
        image,
        "/bin/sh -c",
        `'${commands[language](filename)}'`,
      ].join(" ");
      console.log(`[runInSandbox][VOLUME] dockerCmd: ${dockerCmd}`);
      const { stdout: out, stderr: err } = await execAsync(dockerCmd, {
        timeout: 30000,
      });
      console.log(`[runInSandbox][VOLUME] stdout:`, out);
      console.log(`[runInSandbox][VOLUME] stderr:`, err);
      stdout = out;
      stderr = err;
      success = true;
    } catch (e: unknown) {
      const error = e as Error;
      console.error(`[runInSandbox][VOLUME] error:`, error);
      if (error.message.includes("No such file or directory")) {
        // Try approach 2: Copy file into container (cat >) for ALL languages
        try {
          dockerCmd = [
            "docker run --rm",
            "--network none",
            "--memory=256m --cpus=0.5",
            `-v \"${tmpDir}:/code\"`,
            image,
            "/bin/sh -c",
            `'cat > /code/${filename} << "EOF"\n${code}\nEOF\n${commands[
              language
            ](filename)}'`,
          ].join(" ");
          console.log(`[runInSandbox][CAT] dockerCmd: ${dockerCmd}`);
          const { stdout: out, stderr: err } = await execAsync(dockerCmd, {
            timeout: 30000,
          });
          console.log(`[runInSandbox][CAT] stdout:`, out);
          console.log(`[runInSandbox][CAT] stderr:`, err);
          stdout = out;
          stderr = err;
          success = true;
        } catch (e2: unknown) {
          // SPECIAL: For Java, try echo code directly in container (no volume mount)
          if (language === "java") {
            try {
              // Escape code for shell
              const safeCode = code
                .replace(/([`$"\\])/g, "\\$1")
                .replace(/\n/g, "\\n");
              dockerCmd = [
                "docker run --rm",
                "--network none",
                "--memory=256m --cpus=0.5",
                image,
                "/bin/sh -c",
                `'mkdir -p /code && echo -e \"${safeCode}\" > /code/Main.java && javac /code/Main.java && java -cp /code Main'`,
              ].join(" ");
              console.log(`[runInSandbox][JAVA-FALLBACK] dockerCmd: ${dockerCmd}`);
              const { stdout: out, stderr: err } = await execAsync(dockerCmd, {
                timeout: 30000,
              });
              console.log(`[runInSandbox][JAVA-FALLBACK] stdout:`, out);
              console.log(`[runInSandbox][JAVA-FALLBACK] stderr:`, err);
              stdout = out;
              stderr = err;
              success = true;
            } catch (e3: unknown) {
              console.error(`[runInSandbox][JAVA-FALLBACK] error:`, e3);
              stderr = `Java code could not be written in container: ${
                (e3 as Error).message
              }`;
            }
          } else {
            const error2 = e2 as Error;
            // Fayl errorunda temp qovluğun path-i də error mesajına əlavə olunsun
            stderr = `Docker volume mounting failed.\nFirst error: ${error.message}\nSecond error: ${error2.message}\nTemp dir: ${tmpDir}`;
          }
        }
      } else {
        stderr = error.message;
      }
    }

    if (!success) {
      if (stderr.includes("timeout")) {
        stderr =
          "Kod icrası çox uzun çəkdi (30 saniyə). Zəhmət olmasa, kodunuzu yoxlayın.";
      } else if (stderr.includes("Unable to find image")) {
        stderr =
          "Docker image yüklənir... Zəhmət olmasa, bir az gözləyin və yenidən cəhd edin.";
      } else if (stderr.includes("No such file or directory")) {
        stderr = `Fayl yaradıla bilmədi: ${filename}. Sistem xətası.`;
      }
      stdout = "";
    }

    // C# üçün yalnız istifadəçi çıxışını göstər
    if (language === "csharp" && stdout) {
      // Dotnet-in status mesajlarını filterlə
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
        "Restore completed",
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
      ];
      const lines = stdout
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(
          (l) =>
            l.length > 0 &&
            !filterPrefixes.some((prefix) => l.startsWith(prefix))
        );
      stdout = lines.join("\n");
    }
    console.log(`[runInSandbox] final stdout:`, stdout);
    console.log(`[runInSandbox] final stderr:`, stderr);
    return { stdout, stderr };
  } finally {
    // Clean up temp directory
    try {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
      console.log(`[runInSandbox] cleaned up tmpDir: ${tmpDir}`);
    } catch (cleanupError) {
      console.error("Failed to cleanup temp directory:", cleanupError);
    }
  }
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
