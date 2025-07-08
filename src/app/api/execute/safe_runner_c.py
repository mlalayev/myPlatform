import sys
import subprocess
import os
import tempfile
import platform
import shutil
import threading

print('DEBUG: safe_runner_c.py called', file=sys.stderr)
print('DEBUG: sys.argv =', sys.argv, file=sys.stderr)
print('DEBUG: PATH =', os.environ.get('PATH'), file=sys.stderr)
sys.stderr.flush()

TIMEOUT = 3  # seconds

if len(sys.argv) < 2:
    print("Usage: python safe_runner_c.py path/to/main.c", file=sys.stderr)
    sys.exit(1)

c_file = sys.argv[1]
base_dir = os.path.dirname(os.path.abspath(c_file))
exe_ext = 'exe' if platform.system().lower().startswith('win') else 'out'
exe_file = os.path.join(base_dir, f"main.{exe_ext}")

print(f'DEBUG: c_file = {c_file}', file=sys.stderr)
print(f'DEBUG: exe_file = {exe_file}', file=sys.stderr)
print(f'DEBUG: c_file exists = {os.path.exists(c_file)}', file=sys.stderr)
sys.stderr.flush()

compile_cmd = ["gcc", c_file, "-o", exe_file]
print(f'DEBUG: compile_cmd = {compile_cmd}', file=sys.stderr)
sys.stderr.flush()

try:
    compile_proc = subprocess.run(compile_cmd, capture_output=True, text=True, timeout=10)
    print(f'DEBUG: compile_proc.returncode = {compile_proc.returncode}', file=sys.stderr)
    print(f'DEBUG: compile_proc.stderr = {compile_proc.stderr}', file=sys.stderr)
    print(f'DEBUG: compile_proc.stdout = {compile_proc.stdout}', file=sys.stderr)
    sys.stderr.flush()
    if compile_proc.returncode != 0:
        print(compile_proc.stderr, file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f"Compile error: {e}", file=sys.stderr)
    sys.exit(1)

print(f'DEBUG: exe_file exists after compile = {os.path.exists(exe_file)}', file=sys.stderr)
sys.stderr.flush()

# Run the executable with timeout
run_cmd = [exe_file]
stdout = ""
stderr = ""
proc = None

def run():
    global proc, stdout, stderr
    try:
        proc = subprocess.Popen(run_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        out, err = proc.communicate()
        stdout = out
        stderr = err
    except Exception as e:
        stderr = str(e)

print(f'DEBUG: run_cmd = {run_cmd}', file=sys.stderr)
sys.stderr.flush()

thread = threading.Thread(target=run)
thread.start()
thread.join(TIMEOUT)
if thread.is_alive():
    if proc:
        try:
            proc.kill()
        except Exception:
            pass
    print("Execution timed out.", file=sys.stderr)
    sys.exit(1)

print(f'DEBUG: run stdout = {stdout}', file=sys.stderr)
print(f'DEBUG: run stderr = {stderr}', file=sys.stderr)
sys.stderr.flush()

if stdout:
    print(stdout, end="")
if stderr:
    print(stderr, file=sys.stderr, end="")

sys.exit(0) 