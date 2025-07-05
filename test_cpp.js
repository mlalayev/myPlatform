const fetch = require('node-fetch');

async function testCpp() {
  try {
    const response = await fetch('http://localhost:3000/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `#include <iostream>
int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}`,
        language: 'cpp'
      })
    });
    
    const result = await response.json();
    console.log('C++ Test Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testCpp(); 