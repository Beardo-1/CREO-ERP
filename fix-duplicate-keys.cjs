const fs = require('fs');

// Read the content file
const content = fs.readFileSync('src/content/app.content.ts', 'utf8');

// Parse the content to find duplicate keys
const lines = content.split('\n');
const keyOccurrences = new Map();
const duplicates = [];

let currentSection = '';
let braceLevel = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track brace level to understand nesting
  braceLevel += (line.match(/{/g) || []).length;
  braceLevel -= (line.match(/}/g) || []).length;
  
  // Detect section comments
  if (line.includes('// ') && line.includes('Module')) {
    currentSection = line.trim();
  }
  
  // Look for key definitions (pattern: "key: {")
  const keyMatch = line.match(/^\s*(\w+):\s*{/);
  if (keyMatch) {
    const key = keyMatch[1];
    const location = `Line ${i + 1}: ${currentSection}`;
    
    if (keyOccurrences.has(key)) {
      keyOccurrences.get(key).push(location);
      if (keyOccurrences.get(key).length === 2) {
        duplicates.push(key);
      }
    } else {
      keyOccurrences.set(key, [location]);
    }
  }
}

console.log('=== DUPLICATE KEYS FOUND ===');
console.log('Total duplicates:', duplicates.length);
console.log('');

duplicates.forEach(key => {
  console.log(`Key "${key}" found in:`);
  keyOccurrences.get(key).forEach(location => {
    console.log(`  - ${location}`);
  });
  console.log('');
});

console.log('=== SUMMARY ===');
console.log('These duplicate keys need to be resolved by:');
console.log('1. Renaming keys to be more specific (e.g., "analytics" -> "inventoryAnalytics")');
console.log('2. Moving common keys to a shared section');
console.log('3. Removing redundant definitions'); 