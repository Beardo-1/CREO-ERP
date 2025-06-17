import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

export const TranslationDemo: React.FC = () => {
  const { 
    t, 
    currentLanguage, 
    isRTL, 
    toggleLanguage, 
    translateDynamic, 
    isTranslating, 
    translationError 
  } = useTranslation();

  const [dynamicText, setDynamicText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    if (!dynamicText.trim()) return;
    
    try {
      const result = await translateDynamic(dynamicText);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  return (
    <div className={`p-6 max-w-4xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header with language toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {t(appContent.sections.propertyPortfolio)}
          </h1>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {currentLanguage === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Static Translation Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {t({ en: 'Static UI Translations', ar: 'ترجمات واجهة المستخدم الثابتة' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-2">
                {t(appContent.sections.contactManagement)}
              </h3>
              <p className="text-sm text-gray-500">
                {t(appContent.descriptions.contactsCount)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-2">
                {t(appContent.sections.dealPipeline)}
              </h3>
              <p className="text-sm text-gray-500">
                {t(appContent.descriptions.dealsCount)}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Translation Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {t({ en: 'Dynamic Content Translation', ar: 'ترجمة المحتوى الديناميكي' })}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t({ en: 'Enter text to translate:', ar: 'أدخل النص للترجمة:' })}
              </label>
              <textarea
                value={dynamicText}
                onChange={(e) => setDynamicText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder={t({ 
                  en: 'Enter property description, client notes, or any dynamic content...', 
                  ar: 'أدخل وصف العقار أو ملاحظات العميل أو أي محتوى ديناميكي...' 
                })}
              />
            </div>
            
            <button
              onClick={handleTranslate}
              disabled={!dynamicText.trim() || isTranslating}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating 
                ? t({ en: 'Translating...', ar: 'جاري الترجمة...' })
                : t({ en: 'Translate', ar: 'ترجم' })
              }
            </button>

            {translationError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {t({ en: 'Translation Error:', ar: 'خطأ في الترجمة:' })} {translationError}
              </div>
            )}

            {translatedText && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  {t({ en: 'Translated Text:', ar: 'النص المترجم:' })}
                </h4>
                <p className="text-blue-700">{translatedText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {t({ en: 'Translation System Comparison', ar: 'مقارنة نظام الترجمة' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                {t({ en: 'Static UI Translations (Intlayer)', ar: 'ترجمات واجهة المستخدم الثابتة' })}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t({ en: 'Instant performance', ar: 'أداء فوري' })}</li>
                <li>• {t({ en: 'Offline capable', ar: 'يعمل بدون إنترنت' })}</li>
                <li>• {t({ en: 'Perfect for UI elements', ar: 'مثالي لعناصر واجهة المستخدم' })}</li>
                <li>• {t({ en: 'Manual translation required', ar: 'يتطلب ترجمة يدوية' })}</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                {t({ en: 'Dynamic Content Translation (LibreTranslate)', ar: 'ترجمة المحتوى الديناميكي' })}
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• {t({ en: 'Automatic translation', ar: 'ترجمة تلقائية' })}</li>
                <li>• {t({ en: 'Supports 30+ languages', ar: 'يدعم أكثر من 30 لغة' })}</li>
                <li>• {t({ en: 'Perfect for user content', ar: 'مثالي لمحتوى المستخدم' })}</li>
                <li>• {t({ en: 'Requires internet connection', ar: 'يتطلب اتصال بالإنترنت' })}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 