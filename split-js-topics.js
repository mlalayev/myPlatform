const fs = require('fs');
const path = require('path');

// Path to your current big JSON file
const inputPath = path.join(__dirname, 'src/app/api/tutorials/[language]/topics/javascript.json');
// Output directory for new structure
const outDir = path.join(__dirname, 'src/app/api/tutorials/javascript');

// Read the big JSON file
const topics = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// UI languages you support
const uiLangs = ['az', 'en', 'ru'];

// 1. Build sidebar topics.json
const sidebar = { az: [], en: [], ru: [] };

topics.forEach(topic => {
  uiLangs.forEach(lang => {
    sidebar[lang].push({
      id: topic.id,
      title: topic.title, // You may want to translate these!
      icon: topic.icon,
      description: topic.description // You may want to translate these!
    });
  });
});

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Write sidebar topics.json
fs.writeFileSync(
  path.join(outDir, 'topics.json'),
  JSON.stringify(sidebar, null, 2),
  'utf8'
);

// 2. Build per-topic files
topics.forEach(topic => {
  const topicContent = {};
  uiLangs.forEach(lang => {
    topicContent[lang] = {
      title: topic.title, // You may want to translate these!
      description: topic.description, // You may want to translate these!
      content: topic.content
    };
  });
  fs.writeFileSync(
    path.join(outDir, `${topic.id}.json`),
    JSON.stringify(topicContent, null, 2),
    'utf8'
  );
});

console.log('Done! Check your src/app/api/tutorials/javascript/ folder.'); 