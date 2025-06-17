const fs = require('fs');
const path = require('path');

// This script downloads translations from Tolgee and updates the i18n configuration
// You can run this manually or set it up as part of your build process

async function downloadTranslations() {
  try {
    // You can use Tolgee CLI to export translations
    // npx @tolgee/cli export --format JSON_I18NEXT --languages en,ar
    
    console.log('To download translations from Tolgee, run:');
    console.log('npx @tolgee/cli export --format JSON_I18NEXT --languages en,ar');
    console.log('');
    console.log('This will create translation files that you can then import into your i18n configuration.');
    
  } catch (error) {
    console.error('Error downloading translations:', error);
  }
}

downloadTranslations(); 