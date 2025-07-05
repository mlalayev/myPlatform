import fetch from 'node-fetch';

async function testSimpleCpp() {
  try {
    console.log('Testing C++ execution...');
    const response = await fetch('http://localhost:3000/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `#include <iostream>
int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}`,
        language: 'cpp'
      })
    });
    
    const result = await response.json();
    console.log('Full result:', JSON.stringify(result, null, 2));
    
    if (result.output) {
      console.log('✅ Output:', result.output);
    }
    if (result.error) {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

testSimpleCpp(); 