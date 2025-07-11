#!/usr/bin/env python3
import sys
import io
import traceback
import signal
import os
import platform

# Set UTF-8 encoding for stdout/stderr
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def timeout_handler(signum, frame):
    print("Error: Code execution timed out", file=sys.stderr)
    sys.exit(1)

def safe_exec(code):
    """Safely execute Python code with restrictions"""
    try:
        # Timeout yalnız Unix sistemlər üçün (Windows-də signal.SIGALRM yoxdur)
        if platform.system() != "Windows":
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(5)  # 5 second timeout
        
        # Create restricted globals
        restricted_globals = {
            '__builtins__': {
                'print': print,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'bool': bool,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'range': range,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'sorted': sorted,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'round': round,
                'type': type,
                'isinstance': isinstance,
                'hasattr': hasattr,
                'getattr': getattr,
                'setattr': setattr,
                'dir': dir,
                'help': help,
                'ValueError': ValueError,
                'TypeError': TypeError,
                'IndexError': IndexError,
                'KeyError': KeyError,
                'AttributeError': AttributeError,
                'Exception': Exception,
                'input': lambda prompt='': input(prompt),
                'open': open,  # Məhdud fayl əməliyyatları üçün
                '__import__': __import__,  # Allow imports again
            }
        }
        
        # Execute the code
        exec(code, restricted_globals)
        
        # Cancel timeout
        if platform.system() != "Windows":
            signal.alarm(0)
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    try:
        # Read code from stdin
        code = sys.stdin.read()
        if code.strip():
            safe_exec(code)
        else:
            print("No code provided", file=sys.stderr)
            sys.exit(1)
    except KeyboardInterrupt:
        print("Execution interrupted", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading input: {str(e)}", file=sys.stderr)
        sys.exit(1)