import subprocess
import tempfile
from pathlib import Path

def test_compilation():
    code = '''#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}'''
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        source_file = tmp_path / "main.cpp"
        executable = tmp_path / "main.exe"
        
        print(f"Writing code to {source_file}")
        source_file.write_text(code, encoding='utf-8')
        
        compile_cmd = [
            'C:\\msys64\\mingw64\\bin\\g++.exe',
            '-std=c++17',
            '-o', str(executable),
            str(source_file)
        ]
        
        print(f"Compile command: {compile_cmd}")
        
        try:
            result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                cwd=tmp_dir,
                timeout=10
            )
            
            print(f"Return code: {result.returncode}")
            print(f"Stdout: '{result.stdout}'")
            print(f"Stderr: '{result.stderr}'")
            print(f"Executable exists: {executable.exists()}")
            
            if executable.exists():
                print("Compilation successful!")
                # Try to run it
                run_result = subprocess.run(
                    [str(executable)],
                    capture_output=True,
                    text=True,
                    cwd=tmp_dir,
                    timeout=5
                )
                print(f"Run result: {run_result.stdout}")
            else:
                print("Compilation failed - no executable created")
                
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    test_compilation() 