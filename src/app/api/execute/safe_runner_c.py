#!/usr/bin/env python3
import subprocess
import sys
import os
import tempfile

def main():
    if len(sys.argv) != 2:
        print("Usage: python safe_runner_c.py <c_file>", file=sys.stderr)
        sys.exit(1)
    
    c_file = sys.argv[1]
    
    if not os.path.exists(c_file):
        print(f"Error: {c_file} does not exist", file=sys.stderr)
        sys.exit(1)
    
    # Create executable name
    exe_file = c_file.replace('.c', '.exe') if os.name == 'nt' else c_file.replace('.c', '')
    
    try:
        # Compile C code
        compile_cmd = [
            'gcc',
            '-finput-charset=UTF-8',
            '-fexec-charset=UTF-8',
            c_file,
            '-o', exe_file
        ]
        
        compile_proc = subprocess.run(
            compile_cmd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if compile_proc.returncode != 0:
            print("Compilation failed:", file=sys.stderr)
            print(compile_proc.stderr, file=sys.stderr)
            sys.exit(1)
        
        # Run compiled program
        run_proc = subprocess.run(
            [exe_file],
            capture_output=True,
            text=True,
            encoding='utf-8',
            timeout=5
        )
        
        print(run_proc.stdout, end='')
        if run_proc.stderr:
            print(run_proc.stderr, file=sys.stderr, end='')
        
        sys.exit(run_proc.returncode)
        
    except subprocess.TimeoutExpired:
        print("Program execution timed out", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()