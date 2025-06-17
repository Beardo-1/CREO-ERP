import fs from 'fs';
import path from 'path';

// Free translation using Google Translate (no API key needed)
async function translateText(text, targetLang) {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error(`Error translating "${text}":`, error);
    return text; // Return original text if translation fails
  }
}

async function translateJsonFile(inputFile, outputFile, targetLang) {
  try {
    const englishTranslations = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const translatedData = {};

    console.log(`Translating to ${targetLang}...`);
    
    for (const [key, value] of Object.entries(englishTranslations)) {
      console.log(`Translating: ${key} = "${value}"`);
      translatedData[key] = await translateText(value, targetLang);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`✅ Translation complete: ${outputFile}`);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

async function main() {
  const englishFile = 'src/locales/en/translation.json';
  const arabicFile = 'src/locales/ar/translation.json';

  if (!fs.existsSync(englishFile)) {
    console.error('English translation file not found:', englishFile);
    return;
  }

  await translateJsonFile(englishFile, arabicFile, 'ar');
  console.log('🎉 Auto-translation complete!');
}

main(); 