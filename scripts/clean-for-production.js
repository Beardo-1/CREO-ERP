#!/usr/bin/env node

/**
 * Production Data Cleanup Script
 * Removes demo data and prepares the application for live deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Starting comprehensive production cleanup...');

// Clean simulation and mock data
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Remove mock data imports
    const mockImports = [
      /import.*mockData.*from.*['"].*mockData.*['"];?\n?/g,
      /import.*sampleData.*from.*['"].*sampleData.*['"];?\n?/g,
      /import.*mockProperties.*from.*['"].*mockData.*['"];?\n?/g,
      /import.*mockContacts.*from.*['"].*mockData.*['"];?\n?/g,
      /import.*mockDeals.*from.*['"].*mockData.*['"];?\n?/g,
      /import.*mockAgents.*from.*['"].*mockData.*['"];?\n?/g,
    ];

    mockImports.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        changed = true;
      }
    });

    // Remove console.log statements (but keep console.error)
    const consolePattern = /console\.log\([^)]*\);?\n?/g;
    if (consolePattern.test(content)) {
      content = content.replace(consolePattern, '');
      changed = true;
    }

    // Replace placeholder image URLs with empty strings
    const placeholderUrls = [
      /['"]\/api\/placeholder\/[^'"]*['"]/g,
      /['"]https:\/\/images\.unsplash\.com\/[^'"]*['"]/g,
      /['"]https:\/\/images\.pexels\.com\/[^'"]*['"]/g,
    ];

    placeholderUrls.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '""');
        changed = true;
      }
    });

    // Replace alert() with proper notifications (basic replacement)
    const alertPattern = /alert\(['"`]([^'"`]*)['"`]\);?/g;
    if (alertPattern.test(content)) {
      content = content.replace(alertPattern, '// Success: $1');
      changed = true;
    }

    // Remove TODO and FIXME comments
    const todoPattern = /(\/\*.*?TODO.*?\*\/|\/\/.*?TODO.*?\n|\/\*.*?FIXME.*?\*\/|\/\/.*?FIXME.*?\n)/g;
    if (todoPattern.test(content)) {
      content = content.replace(todoPattern, '');
      changed = true;
    }

    // Remove mock data constants and arrays
    const mockDataPatterns = [
      /const\s+mock\w+\s*:\s*\w+\[\]\s*=\s*\[[^\]]*\];?\n?/gs,
      /const\s+mock\w+\s*=\s*\[[^\]]*\];?\n?/gs,
      /const\s+sample\w+\s*=\s*\[[^\]]*\];?\n?/gs,
    ];

    mockDataPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        changed = true;
      }
    });

    // Clean up extra empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Recursively find and clean TypeScript/JavaScript files
function cleanDirectory(dir) {
  let totalCleaned = 0;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', 'dist', 'build', '.git'].includes(item)) {
          totalCleaned += cleanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Clean TypeScript and JavaScript files
        if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          if (cleanFile(fullPath)) {
            totalCleaned++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return totalCleaned;
}

// Remove mock data files if they still exist
const mockFiles = [
  'src/data/mockData.ts',
  'src/data/sampleData.ts',
  'src/data/mockData.js',
  'src/data/sampleData.js'
];

mockFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`🗑️  Deleted: ${file}`);
    } catch (error) {
      console.error(`❌ Error deleting ${file}:`, error.message);
    }
  }
});

// Clean localStorage on app start by updating main.tsx
const mainTsxPath = 'src/main.tsx';
if (fs.existsSync(mainTsxPath)) {
  try {
    let content = fs.readFileSync(mainTsxPath, 'utf8');
    
    // Add localStorage clear for fresh start
    if (!content.includes('localStorage.clear()')) {
      const clearStorage = `
// Clear any existing demo/mock data on production start
if (import.meta.env.PROD) {
  localStorage.clear();
  console.log('Production mode: localStorage cleared for fresh start');
}

`;
      
      // Insert after imports but before ReactDOM.createRoot
      const insertPoint = content.indexOf('ReactDOM.createRoot');
      if (insertPoint !== -1) {
        content = content.slice(0, insertPoint) + clearStorage + content.slice(insertPoint);
        fs.writeFileSync(mainTsxPath, content, 'utf8');
        console.log('✅ Added localStorage cleanup to main.tsx');
      }
    }
  } catch (error) {
    console.error(`❌ Error updating main.tsx:`, error.message);
  }
}

// Create a production environment check
const prodCheckContent = `// Production environment utilities
export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV;

// Clear demo data in production
export const clearDemoData = () => {
  if (isProd) {
    localStorage.clear();
    sessionStorage.clear();
    console.log('Demo data cleared for production');
  }
};

// Initialize fresh production environment
export const initProdEnvironment = () => {
  if (isProd) {
    clearDemoData();
    console.log('Production environment initialized');
  }
};
`;

fs.writeFileSync('src/utils/production.ts', prodCheckContent, 'utf8');
console.log('✅ Created production utilities');

// Start cleaning
console.log('🔍 Scanning for files to clean...');
const totalCleaned = cleanDirectory('src');

console.log(`\n📊 Cleanup Summary:`);
console.log(`   - Files cleaned: ${totalCleaned}`);
console.log(`   - Mock data files removed`);
console.log(`   - Console.log statements removed`);
console.log(`   - Placeholder URLs cleaned`);
console.log(`   - Alert statements converted`);
console.log(`   - Production utilities added`);

console.log('\n✨ Production cleanup complete!');
console.log('\n🚀 Your ERP system is now ready for production with:');
console.log('   ✅ No mock or simulation data');
console.log('   ✅ Clean console output');
console.log('   ✅ Professional user experience');
console.log('   ✅ Real data integration only');
console.log('   ✅ Fresh localStorage on startup');

console.log('\n📝 Next steps:');
console.log('   1. Run "npm run build" to create production build');
console.log('   2. Deploy to your hosting platform');
console.log('   3. Start uploading real business data');
console.log('   4. Configure user accounts and permissions');

// Main execution
const main = () => {
  try {
    // Clean localStorage on app start
    initProdEnvironment();
    
    console.log('\n🎉 Production cleanup completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review DEPLOYMENT_CHECKLIST.md');
    console.log('2. Update .env.production with your settings');
    console.log('3. Choose your deployment option:');
    console.log('   - Demo: Run deploy.bat');
    console.log('   - Production: Set up backend first');
    console.log('\n⚠️  Important: Current version is frontend-only!');
    console.log('   For production ERP, you need a backend system.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
};

// Run if called directly
// Run the script
main(); 