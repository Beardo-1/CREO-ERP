const fs = require('fs');
const path = require('path');

console.log('🔍 CREO ERP - Comprehensive Route Audit');
console.log('=====================================\n');

// Read App.tsx to extract all route cases
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

// Extract all case statements from the switch
const caseRegex = /case\s+['"`]([^'"`]+)['"`]:/g;
let match;
const routeCases = [];

while ((match = caseRegex.exec(appTsxContent)) !== null) {
  routeCases.push(match[1]);
}

console.log('📍 Routes defined in App.tsx switch statement:');
console.log('==============================================');
routeCases.forEach((route, index) => {
  console.log(`${index + 1}. ${route}`);
});

// Read Sidebar.tsx to extract all navigation items
const sidebarPath = path.join(__dirname, 'src', 'components', 'Layout', 'Sidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Extract sidebar navigation items from the translatedMenuCategories
const sidebarItems = [];

// Extract main items
const mainItemRegex = /id:\s*['"`]([^'"`]+)['"`]/g;
while ((match = mainItemRegex.exec(sidebarContent)) !== null) {
  if (!match[1].includes('category-') && !match[1].includes('badge-')) {
    sidebarItems.push(match[1]);
  }
}

console.log('\n🧭 Navigation items defined in Sidebar:');
console.log('======================================');
sidebarItems.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

// Find missing routes
const missingRoutes = sidebarItems.filter(item => !routeCases.includes(item));
const unusedRoutes = routeCases.filter(route => !sidebarItems.includes(route) && route !== 'default');

console.log('\n❌ Missing Routes (in Sidebar but not in App.tsx):');
console.log('=================================================');
if (missingRoutes.length === 0) {
  console.log('✅ No missing routes found!');
} else {
  missingRoutes.forEach((route, index) => {
    console.log(`${index + 1}. ${route}`);
  });
}

console.log('\n⚠️  Unused Routes (in App.tsx but not in Sidebar):');
console.log('=================================================');
if (unusedRoutes.length === 0) {
  console.log('✅ No unused routes found!');
} else {
  unusedRoutes.forEach((route, index) => {
    console.log(`${index + 1}. ${route}`);
  });
}

// Check for potential routing issues
console.log('\n🔧 Potential Routing Issues:');
console.log('============================');

const potentialIssues = [];

// Check for routes that might have naming inconsistencies
const dashRoutes = routeCases.filter(route => route.includes('-'));
const underscoreRoutes = routeCases.filter(route => route.includes('_'));

if (dashRoutes.length > 0 && underscoreRoutes.length > 0) {
  potentialIssues.push('Mixed naming conventions: Some routes use dashes, others use underscores');
}

// Check for parent routes that might need redirection
const parentRoutes = ['properties', 'contacts', 'deals', 'leads', 'marketing', 'inventory', 'agents', 'financial', 'reports'];
const hasParentRedirects = parentRoutes.every(parent => routeCases.includes(parent));

if (!hasParentRedirects) {
  const missingParents = parentRoutes.filter(parent => !routeCases.includes(parent));
  potentialIssues.push(`Missing parent route redirects: ${missingParents.join(', ')}`);
}

if (potentialIssues.length === 0) {
  console.log('✅ No potential routing issues detected!');
} else {
  potentialIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
}

// Generate route testing commands
console.log('\n🧪 Route Testing Recommendations:');
console.log('=================================');
console.log('Test these critical navigation paths:');

const criticalPaths = [
  'dashboard',
  'properties → properties-listings → active-listings',
  'contacts → contacts-clients → clients',
  'deals → deals-active → active-deals',
  'leads → leads-new → new-leads',
  'leads → leads-follow-up → follow-up-leads',
  'marketing → marketing-campaigns',
  'analytics',
  'reports',
  'financial',
  'tasks',
  'calendar',
  'inventory'
];

criticalPaths.forEach((path, index) => {
  console.log(`${index + 1}. ${path}`);
});

console.log('\n📊 Route Statistics:');
console.log('===================');
console.log(`Total routes in App.tsx: ${routeCases.length}`);
console.log(`Total sidebar items: ${sidebarItems.length}`);
console.log(`Missing routes: ${missingRoutes.length}`);
console.log(`Unused routes: ${unusedRoutes.length}`);
console.log(`Route coverage: ${Math.round((sidebarItems.length - missingRoutes.length) / sidebarItems.length * 100)}%`);

console.log('\n✅ Audit Complete!');
console.log('==================');
console.log('Next steps:');
console.log('1. Fix any missing routes identified above');
console.log('2. Test critical navigation paths');
console.log('3. Verify all components are properly imported');
console.log('4. Check translation keys for all routes'); 