const fetch = require('node-fetch');
const langs = ['python', 'cpp', 'c', 'java', 'php', 'csharp', 'go', 'rust'];
const code = {
  python: 'print("ok")',
  cpp: '#include <iostream>\nint main() { std::cout << "ok"; return 0; }',
  c: '#include <stdio.h>\nint main() { printf("ok"); return 0; }',
  java: 'public class Main { public static void main(String[] args) { System.out.println("ok"); } }',
  php: '<?php echo "ok";',
  csharp: 'using System; class Program { static void Main() { Console.WriteLine("ok"); } }',
  go: 'package main\nimport "fmt"\nfunc main() { fmt.Println("ok") }',
  rust: 'fn main() { println!("ok"); }',
};
(async () => {
  for (const lang of langs) {
    try {
      await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code[lang], language: lang }),
      });
    } catch (e) {}
  }
})(); 