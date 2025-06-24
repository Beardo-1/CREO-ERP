const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../src/content/app.content.ts');
const content = fs.readFileSync(FILE, 'utf8');

// Regex to match keys in the form: keyName: { ... },
const keyRegex = /([a-zA-Z0-9_]+):\s*\{[^}]*\},?/g;

let seen = new Set();
let output = '';
let lastIndex = 0;
let match;

while ((match = keyRegex.exec(content)) !== null) {
  const key = match[1];
  if (!seen.has(key)) {
    seen.add(key);
    output += content.slice(lastIndex, keyRegex.lastIndex);
  }
  lastIndex = keyRegex.lastIndex;
}
output += content.slice(lastIndex);

fs.writeFileSync(FILE, output, 'utf8');
console.log('Duplicate keys removed from app.content.ts'); 