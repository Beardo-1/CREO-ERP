const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../src/content/app.content.ts');
let content = fs.readFileSync(FILE, 'utf8');

// Regex to find object entries that are missing a comma after the closing brace
// This will match lines like: key: { ... }\n  key2: { ... }
// and add a comma after the first closing brace if missing
content = content.replace(/(\}\n\s*)([a-zA-Z0-9_]+:)\s*\{/g, '},\n  $2 {');

fs.writeFileSync(FILE, content, 'utf8');
console.log('Missing commas fixed in app.content.ts'); 