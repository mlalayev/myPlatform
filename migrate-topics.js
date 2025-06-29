const fs = require('fs');
const path = require('path');

// Read the original javascript.json file
const originalPath = path.join(__dirname, 'src/app/api/tutorials/[language]/topics/javascript.json');
const originalContent = JSON.parse(fs.readFileSync(originalPath, 'utf-8'));

// Topics that have already been created
const createdTopics = ['variables', 'function-declaration', 'arrow-functions', 'function-expression'];

// Extract remaining topics
const remainingTopics = originalContent.filter(topic => !createdTopics.includes(topic.id));

console.log('Remaining topics to migrate:');
remainingTopics.forEach(topic => {
  console.log(`- ${topic.id}: ${topic.title}`);
});

// Create individual files for remaining topics
remainingTopics.forEach(topic => {
  const fileName = `${topic.id}.json`;
  const filePath = path.join(__dirname, 'src/app/api/tutorials/[language]/topics/javascript', fileName);
  
  // Write the topic to its own file
  fs.writeFileSync(filePath, JSON.stringify(topic, null, 2));
  console.log(`Created: ${fileName}`);
});

console.log('\nMigration completed!');
console.log('You can now delete the original javascript.json file if you want.'); 