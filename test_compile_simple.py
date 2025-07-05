import subprocess
import os

# Create a simple test file in current directory
test_code = '''#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}'''

with open('test_main.cpp', 'w') as f:
    f.write(test_code)

print("Created test_main.cpp")

# Try to compile it
cmd = ['C:\\msys64\\mingw64\\bin\\g++.exe', '-std=c++17', '-o', 'test_main.exe', 'test_main.cpp']
print(f"Running: {cmd}")

try:
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
    print(f"Return code: {result.returncode}")
    print(f"Stdout: '{result.stdout}'")
    print(f"Stderr: '{result.stderr}'")
    print(f"File exists: {os.path.exists('test_main.exe')}")
    
    if os.path.exists('test_main.exe'):
        print("Success! Trying to run...")
        run_result = subprocess.run(['./test_main.exe'], capture_output=True, text=True)
        print(f"Output: {run_result.stdout}")
    else:
        print("Compilation failed")
        
except Exception as e:
    print(f"Exception: {e}") 