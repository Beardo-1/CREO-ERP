// Script to clear all localStorage data for Creo ERP
// Run this in browser console: localStorage.clear(); location.reload();

console.log('=== CREO ERP DATA CLEANUP ===');
console.log('Clearing all localStorage data...');

// Clear all localStorage
localStorage.clear();

// Clear specific Creo ERP keys if they exist
const creoKeys = [
  'creo-properties',
  'creo-contacts', 
  'creo-deals',
  'creo-agents',
  'creo-auth',
  'creo-user',
  'creo-session'
];

creoKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`Cleared: ${key}`);
});

console.log('✅ All data cleared!');
console.log('Reloading page...');

// Reload the page to start fresh
location.reload(); 