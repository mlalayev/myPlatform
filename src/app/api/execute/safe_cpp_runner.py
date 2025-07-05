#!/usr/bin/env python3
import subprocess
import sys
import os
import tempfile
from pathlib import Path

def windows_to_msys_path(win_path):
    """Convert Windows path to MSYS2 Unix-style path."""
    # Convert backslashes to forward slashes
    path = win_path.replace('\\', '/')
    # Replace drive letter (e.g., C:) with /c
    if path[1] == ':':
        drive = path[0].lower()
        path = f'/{drive}{path[2:]}'
    return path

def run_cpp_safely(code, timeout=3):
    # print(f"DEBUG: Starting C++ execution with timeout={timeout}", file=sys.stderr)
    # print(f"DEBUG: Environment PATH: {os.environ.get('PATH')}", file=sys.stderr)
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        source_file = tmp_path / "main.cpp"
        executable = tmp_path / "main.exe"
        # print(f"DEBUG: Writing code to {source_file}", file=sys.stderr)
        # print(f"DEBUG: Code content: {repr(code)}", file=sys.stderr)
        source_file.write_text(code, encoding='utf-8')
        # print(f"DEBUG: Source file exists: {source_file.exists()}", file=sys.stderr)
        # print(f"DEBUG: Code written successfully", file=sys.stderr)
        try:
            # Use MSYS2 bash to set up the MinGW environment
            msys_bash = "C:\\msys64\\usr\\bin\\bash.exe"
            if not os.path.exists(msys_bash):
                return "", "MSYS2 bash not found at C:\\msys64\\usr\\bin\\bash.exe", 1
            
            # Set up environment
            env = os.environ.copy()
            env['MSYSTEM'] = 'MINGW64'
            env['PATH'] = f"C:\\msys64\\mingw64\\bin;C:\\msys64\\usr\\bin;{env.get('PATH', '')}"
            
            # Test g++ version
            version_cmd = [msys_bash, "-lc", "g++ --version"]
            # print(f"DEBUG: Version command: {version_cmd}", file=sys.stderr)
            version_result = subprocess.run(
                version_cmd,
                capture_output=True,
                text=True,
                timeout=5,
                encoding='utf-8',
                errors='replace',
                env=env
            )
            # print(f"DEBUG: g++ version test - returncode: {version_result.returncode}, stdout: '{version_result.stdout[:100]}'", file=sys.stderr)
            if version_result.returncode != 0:
                return "", f"g++ version check failed: {version_result.stderr}", 1
            
            # Convert Windows paths to MSYS2 Unix-style paths
            msys_source_file = windows_to_msys_path(str(source_file))
            msys_executable = windows_to_msys_path(str(executable))
            
            # Compile with verbose output
            compile_cmd = [msys_bash, "-lc", f"g++ -v -std=c++17 -o {msys_executable} {msys_source_file}"]
            # print(f"DEBUG: Compile command: {compile_cmd}", file=sys.stderr)
            try:
                # print(f"DEBUG: Running compilation...", file=sys.stderr)
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
                # print(f"DEBUG: Compilation result - returncode: {compile_result.returncode}, stdout: '{compile_result.stdout}', stderr: '{compile_result.stderr}'", file=sys.stderr)
                # print(f"DEBUG: Executable exists after compilation: {executable.exists()}", file=sys.stderr)
                if compile_result.returncode != 0:
                    error_msg = compile_result.stderr if compile_result.stderr else "Compilation failed with no error message"
                    # print(f"DEBUG: Returning error: {error_msg}", file=sys.stderr)
                    return "", error_msg, compile_result.returncode
            except subprocess.TimeoutExpired:
                return "", "Compilation timed out", 1
            except FileNotFoundError:
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
                    # print(f"DEBUG: stdout='{run_result.stdout}', stderr='{run_result.stderr}', returncode={run_result.returncode}", file=sys.stderr)
                    return run_result.stdout, run_result.stderr, run_result.returncode
                except subprocess.TimeoutExpired:
                    return "", "Execution timed out", 1
                except Exception as e:
                    return "", f"Runtime error: {str(e)}", 1
            else:
                return "", "Compilation failed - executable not created", 1
        except Exception as e:
            return "", f"Error: {str(e)}", 1

if __name__ == "__main__":
    code = sys.stdin.read()
    # print(f"DEBUG: Received code length: {len(code)}", file=sys.stderr)
    stdout, stderr, exit_code = run_cpp_safely(code)
    # print(f"DEBUG: Final result - stdout: '{stdout}', stderr: '{stderr}', exit_code: {exit_code}", file=sys.stderr)
    if stdout:
        print(stdout, end='')
    if stderr:
        print(stderr, file=sys.stderr, end='')
    sys.exit(exit_code)