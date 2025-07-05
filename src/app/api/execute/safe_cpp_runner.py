#!/usr/bin/env python3
import subprocess
import sys
import os
import tempfile
from pathlib import Path
import re

def windows_to_msys_path(win_path):
    """Convert Windows path to MSYS2 Unix-style path."""
    path = win_path.replace('\\', '/')
    if path[1] == ':':
        drive = path[0].lower()
        path = f'/{drive}{path[2:]}'
    return path

def get_error_message(lang, message_key):
    """Get error message in the specified language."""
    messages = {
        'az': {
            'operation_limit': 'Xəta: 5-dən çox əməliyyat yerinə yetirilə bilməz',
            'execution_timeout': 'Xəta: İcra vaxtı çox uzun oldu, zəhmət olmasa kodunuzu yoxlayın',
            'compilation_timeout': 'Kompilyasiya vaxtı doldu',
            'compilation_failed': 'Kompilyasiya uğursuz oldu',
            'msys2_not_found': 'MSYS2 bash C:\\msys64\\usr\\bin\\bash.exe-də tapılmadı',
            'gpp_not_found': 'MSYS2 bash və ya g++ tapılmadı',
            'runtime_error': 'İcra xətası',
            'executable_not_created': 'Kompilyasiya uğursuz oldu - icra faylı yaradılmadı'
        },
        'ru': {
            'operation_limit': 'Ошибка: Нельзя выполнить более 5 операций',
            'execution_timeout': 'Ошибка: Выполнение заняло слишком много времени, пожалуйста, проверьте ваш код',
            'compilation_timeout': 'Время компиляции истекло',
            'compilation_failed': 'Компиляция не удалась',
            'msys2_not_found': 'MSYS2 bash не найден в C:\\msys64\\usr\\bin\\bash.exe',
            'gpp_not_found': 'MSYS2 bash или g++ не найден',
            'runtime_error': 'Ошибка выполнения',
            'executable_not_created': 'Компиляция не удалась - исполняемый файл не создан'
        },
        'en': {
            'operation_limit': 'Error: Cannot perform more than 5 operations',
            'execution_timeout': 'Error: Execution took too long, please check your code',
            'compilation_timeout': 'Compilation timed out',
            'compilation_failed': 'Compilation failed',
            'msys2_not_found': 'MSYS2 bash not found at C:\\msys64\\usr\\bin\\bash.exe',
            'gpp_not_found': 'MSYS2 bash or g++ not found',
            'runtime_error': 'Runtime error',
            'executable_not_created': 'Compilation failed - executable not created'
        }
    }
    
    # Default to English if language not found
    lang_messages = messages.get(lang, messages['en'])
    return lang_messages.get(message_key, messages['en'][message_key])

def inject_operation_limiter(code, user_lang='en'):
    """Inject code to limit std::cout operations to 5."""
    lines = code.split('\n')
    modified_lines = []
    
    # Get the error message in the user's language
    error_msg = get_error_message(user_lang, 'operation_limit')
    
    operation_counter_code = f"""#include <iostream>
static int __operation_counter = 0;
#define MAX_OPERATIONS 5
"""
    
    for i, line in enumerate(lines):
        # Detect cout statements
        if re.search(r'\bstd::cout\b', line):
            modified_lines.append(f'    if (++__operation_counter > MAX_OPERATIONS) {{ std::cerr << "{error_msg}" << std::endl; exit(1); }}')
            modified_lines.append(line)
        else:
            modified_lines.append(line)
    
    # Insert counter code after #include directives or at start
    include_idx = 0
    for i, line in enumerate(modified_lines):
        if not line.strip().startswith('#include'):
            include_idx = i
            break
    
    modified_lines.insert(include_idx, operation_counter_code)
    return '\n'.join(modified_lines)

def run_cpp_safely(code, timeout=5, debug=False):
    """Run C++ code safely with operation limit of 5 and 5-second timeout."""
    def log(message):
        if debug:
            print(f"DEBUG: {message}", file=sys.stderr, flush=True)

    # Get user language from environment variable
    user_lang = os.environ.get('USER_LANG', 'en')
    log(f"User language: {user_lang}")

    log(f"Starting C++ execution with timeout={timeout}")
    log(f"Environment PATH: {os.environ.get('PATH')}")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        source_file = tmp_path / "main.cpp"
        executable = tmp_path / "main.exe"
        
        # Inject operation limiter code with user language
        modified_code = inject_operation_limiter(code, user_lang)
        log(f"Writing modified code to {source_file}")
        log(f"Modified code content: {repr(modified_code)}")
        source_file.write_text(modified_code, encoding='utf-8')
        log(f"Source file exists: {source_file.exists()}")
        log(f"Code written successfully")
        
        try:
            msys_bash = "C:\\msys64\\usr\\bin\\bash.exe"
            if not os.path.exists(msys_bash):
                log("MSYS2 bash not found")
                return "", get_error_message(user_lang, 'msys2_not_found'), 1
            
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
                return "", f"{get_error_message(user_lang, 'gpp_not_found')}: {version_result.stderr}", 1
            
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
                    error_msg = compile_result.stderr if compile_result.stderr else get_error_message(user_lang, 'compilation_failed')
                    log(f"Returning error: {error_msg}")
                    return "", error_msg, compile_result.returncode
            except subprocess.TimeoutExpired:
                log("Compilation timed out")
                return "", get_error_message(user_lang, 'compilation_timeout'), 1
            except FileNotFoundError:
                log("MSYS2 bash or g++ not found")
                return "", get_error_message(user_lang, 'gpp_not_found'), 1
            
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
                    log("Execution took too long")
                    return "", get_error_message(user_lang, 'execution_timeout'), 1
                except Exception as e:
                    log(f"Runtime error: {str(e)}")
                    return "", f"{get_error_message(user_lang, 'runtime_error')}: {str(e)}", 1
            else:
                log("Compilation failed - executable not created")
                return "", get_error_message(user_lang, 'executable_not_created'), 1
        except Exception as e:
            log(f"Error: {str(e)}")
            return "", f"{get_error_message(user_lang, 'runtime_error')}: {str(e)}", 1

if __name__ == "__main__":
    code = sys.stdin.read()
    debug = os.environ.get('DEBUG', '0') == '1'  # Enable debug with DEBUG=1
    user_lang = os.environ.get('USER_LANG', 'en')  # Get user language
    
    log = lambda msg: print(f"DEBUG: {msg}", file=sys.stderr, flush=True) if debug else lambda x: None
    log(f"Received code length: {len(code)}")
    log(f"User language from environment: {user_lang}")
    log(f"All environment variables: {dict(os.environ)}")
    
    stdout, stderr, exit_code = run_cpp_safely(code, debug=debug)
    log(f"Final result - stdout: '{stdout}', stderr: '{stderr}', exit_code: {exit_code}")
    if stdout:
        print(stdout, end='', flush=True)
    if stderr and not debug:  # Only print stderr if not in debug mode
        print(stderr, file=sys.stderr, end='', flush=True)
    sys.exit(exit_code)