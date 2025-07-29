const fetch = require('node-fetch');

async function testSyncAPI() {
  try {
    console.log('Testing sync achievements API...\n');

    // First, we need to get a session. In a real scenario, this would come from the browser
    // For testing, we'll just make the API call and see what happens
    const response = await fetch('http://localhost:3000/api/user/sync-achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const errorData = await response.json();
      console.log('Error:', errorData);
    }

  } catch (error) {
    console.error('Error testing sync API:', error);
  }
}

testSyncAPI(); 