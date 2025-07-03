import builtins
import sys

# Remove dangerous built-ins (but keep 'exec' and '__import__' and others needed by the runner)
for name in [
    'open', 'eval', 'compile', 'input', 'exit', 'quit', 'help', 'dir', 'globals', 'locals', 'vars'
]:
    if hasattr(builtins, name):
        delattr(builtins, name)

# Remove only the most dangerous modules (allow math, random, datetime, json)
for mod in [
    'os', 'subprocess', 'shutil', 'requests', 'http', 'urllib'
]:
    if mod in sys.modules:
        sys.modules[mod] = None

# Limit print calls
MAX_PRINT_CALLS = 5
_print_count = 0
_real_print = print

def limited_print(*args, **kwargs):
    global _print_count
    if _print_count < MAX_PRINT_CALLS:
        _real_print(*args, **kwargs)
        _print_count += 1
    elif _print_count == MAX_PRINT_CALLS:
        _real_print("[output truncated: too many print calls]")
        _print_count += 1

builtins.print = limited_print

# Read user code from stdin
user_code = sys.stdin.read()

try:
    exec(user_code, {'__builtins__': builtins.__dict__})
except Exception as e:
    _real_print(f"Error: {e}\nXəta: {e}\nОшибка: {e}", file=sys.stderr) 