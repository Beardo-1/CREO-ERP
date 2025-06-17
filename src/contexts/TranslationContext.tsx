import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import translationService, { TranslationOptions } from '../services/translationService';

export type Language = 'en' | 'ar';

interface TranslationContextType {
  // Static translations (existing Intlayer system)
  currentLanguage: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (content: { en: string; ar: string }) => string;
  
  // Dynamic translations (LibreTranslate)
  translateDynamic: (text: string, targetLang?: string) => Promise<string>;
  translateBatch: (texts: string[], targetLang?: string) => Promise<string[]>;
  detectLanguage: (text: string) => Promise<{ language: string; confidence: number }>;
  isTranslating: boolean;
  translationError: string | null;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Translation function
  const t = (content: { en: string; ar: string }) => {
    return content[currentLanguage] || content.en;
  };

  // Map our language codes to LibreTranslate codes
  const getLibreTranslateCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'en',
      'ar': 'ar'
    };
    return langMap[lang] || 'en';
  };

  const translateDynamic = useCallback(async (
    text: string, 
    targetLang?: string
  ): Promise<string> => {
    setIsTranslating(true);
    setTranslationError(null);

    try {
      const target = targetLang || getLibreTranslateCode(currentLanguage);
      const options: TranslationOptions = {
        target,
        source: 'auto'
      };

      const result = await translationService.translateContent(text, options);
      return result.translatedText;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setTranslationError(errorMessage);
      console.error('Dynamic translation error:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const translateBatch = useCallback(async (
    texts: string[], 
    targetLang?: string
  ): Promise<string[]> => {
    setIsTranslating(true);
    setTranslationError(null);

    try {
      const target = targetLang || getLibreTranslateCode(currentLanguage);
      const options: TranslationOptions = {
        target,
        source: 'auto'
      };

      const result = await translationService.translateBatch(texts, options);
      return Array.isArray(result.translatedText) 
        ? result.translatedText 
        : [result.translatedText];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Batch translation failed';
      setTranslationError(errorMessage);
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const detectLanguage = useCallback(async (
    text: string
  ): Promise<{ language: string; confidence: number }> => {
    try {
      return await translationService.detectLanguage(text);
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'en', confidence: 0 };
    }
  }, []);

  // Language switching logic
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setIsRTL(lang === 'ar');
    
    // Update document direction and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update body class for RTL styling
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Store preference in localStorage
    localStorage.setItem('language', lang);
    localStorage.setItem('direction', lang === 'ar' ? 'rtl' : 'ltr');
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const savedDirection = localStorage.getItem('direction');
    
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      setIsRTL(savedLanguage === 'ar');
      document.documentElement.dir = savedDirection || (savedLanguage === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.lang = savedLanguage;
      
      if (savedLanguage === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  }, []);

  const value: TranslationContextType = {
    // Static translations
    currentLanguage,
    isRTL,
    toggleLanguage,
    setLanguage,
    t,
    
    // Dynamic translations
    translateDynamic,
    translateBatch,
    detectLanguage,
    isTranslating,
    translationError,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Enhanced useTranslation hook with dynamic translation capabilities
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 