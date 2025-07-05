#!/usr/bin/env python3
import subprocess
import sys
import os
import tempfile
from pathlib import Path

def windows_to_msys_path(win_path):
    """Convert Windows path to MSYS2 Unix-style path."""
    path = win_path.replace('\\', '/')
    if path[1] == ':':
        drive = path[0].lower()
        path = f'/{drive}{path[2:]}'
    return path

def run_cpp_safely(code, timeout=3, debug=False):
    """Run C++ code safely, with optional debug logging."""
    def log(message):
        if debug:
            print(f"DEBUG: {message}", file=sys.stderr, flush=True)

    log(f"Starting C++ execution with timeout={timeout}")
    log(f"Environment PATH: {os.environ.get('PATH')}")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        source_file = tmp_path / "main.cpp"
        executable = tmp_path / "main.exe"
        log(f"Writing code to {source_file}")
        log(f"Code content: {repr(code)}")
        source_file.write_text(code, encoding='utf-8')
        log(f"Source file exists: {source_file.exists()}")
        log(f"Code written successfully")
        try:
            msys_bash = "C:\\msys64\\usr\\bin\\bash.exe"
            if not os.path.exists(msys_bash):
                log("MSYS2 bash not found")
                return "", "MSYS2 bash not found at C:\\msys64\\usr\\bin\\bash.exe", 1
            
            env = os.environ.copy()
            env['MSYSTEM'] = 'MINGW64'
            env['PATH'] = f"C:\\msys64\\mingw64\\bin;C:\\msys64\\usr\\bin;{env.get('PATH', '')}"
            
            version_cmd = [msys_bash, "-lc", "g++ --version"]
            log(f"Version command: {version_cmd}")
            version_result = subprocess.run(
                version_cmd,
                capture_output=True,
                text=True,
                timeout=5,
                encoding='utf-8',
                errors='replace',
                env=env
            )
            log(f"g++ version test - returncode: {version_result.returncode}, stdout: '{version_result.stdout[:100]}'")
            if version_result.returncode != 0:
                log(f"g++ version check failed: {version_result.stderr}")
                return "", f"g++ version check failed: {version_result.stderr}", 1
            
            msys_source_file = windows_to_msys_path(str(source_file))
            msys_executable = windows_to_msys_path(str(executable))
            
            compile_cmd = [msys_bash, "-lc", f"g++ -std=c++17 -o {msys_executable} {msys_source_file}"]
            log(f"Compile command: {compile_cmd}")
            try:
                log("Running compilation...")
                compile_result = subprocess.run(
                    compile_cmd,
                    capture_output=True,
                    text=True,
                    cwd=tmp_dir,
                    timeout=5,
                    encoding='utf-8',
                    errors='replace',
                    env=env
                )
                log(f"Compilation result - returncode: {compile_result.returncode}, stdout: '{compile_result.stdout}', stderr: '{compile_result.stderr}'")
                log(f"Executable exists after compilation: {executable.exists()}")
                if compile_result.returncode != 0:
                    error_msg = compile_result.stderr if compile_result.stderr else "Compilation failed with no error message"
                    log(f"Returning error: {error_msg}")
                    return "", error_msg, compile_result.returncode
            except subprocess.TimeoutExpired:
                log("Compilation timed out")
                return "", "Compilation timed out", 1
            except FileNotFoundError:
                log("MSYS2 bash or g++ not found")
                return "", "MSYS2 bash or g++ not found", 1
            
            if executable.exists():
                try:
                    run_result = subprocess.run(
                        [str(executable)],
                        capture_output=True,
                        text=True,
                        cwd=tmp_dir,
                        timeout=timeout,
                        encoding='utf-8',
                        errors='replace',
                        env=env
                    )
                    log(f"stdout='{run_result.stdout}', stderr='{run_result.stderr}', returncode={run_result.returncode}")
                    return run_result.stdout, run_result.stderr, run_result.returncode
                except subprocess.TimeoutExpired:
                    log("Execution timed out")
                    return "", "Execution timed out", 1
                except Exception as e:
                    log(f"Runtime error: {str(e)}")
                    return "", f"Runtime error: {str(e)}", 1
            else:
                log("Compilation failed - executable not created")
                return "", "Compilation failed - executable not created", 1
        except Exception as e:
            log(f"Error: {str(e)}")
            return "", f"Error: {str(e)}", 1

if __name__ == "__main__":
    code = sys.stdin.read()
    debug = os.environ.get('DEBUG', '0') == '1'  # Enable debug with DEBUG=1
    log = lambda msg: print(f"DEBUG: {msg}", file=sys.stderr, flush=True) if debug else lambda x: None
    log(f"Received code length: {len(code)}")
    stdout, stderr, exit_code = run_cpp_safely(code, debug=debug)
    log(f"Final result - stdout: '{stdout}', stderr: '{stderr}', exit_code: {exit_code}")
    if stdout:
        print(stdout, end='', flush=True)
    if stderr and not debug:  # Only print stderr if not in debug mode
        print(stderr, file=sys.stderr, end='', flush=True)
    sys.exit(exit_code)