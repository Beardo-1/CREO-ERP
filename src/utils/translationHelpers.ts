/**
 * Translation Helper Utilities
 * 
 * Provides enhanced translation functionality with better error handling,
 * fallbacks, and debugging capabilities for the CREO ERP system.
 */

import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

// Enhanced translation function with better error handling
export const safeTranslate = (
  t: (content: any) => string,
  key: any,
  fallback?: string,
  context?: string
): string => {
  try {
    // Handle null/undefined keys
    if (key === null || key === undefined) {
      const fallbackText = fallback || 'Translation Missing';
      if (import.meta.env.DEV) {
        console.warn(`Translation key is null/undefined${context ? ` in ${context}` : ''}`);
      }
      return fallbackText;
    }

    // Handle string keys (already translated)
    if (typeof key === 'string') {
      return key;
    }

    // Handle translation objects
    if (typeof key === 'object' && key.en) {
      return t(key);
    }

    // Fallback for invalid keys
    const fallbackText = fallback || 'Translation Error';
    if (import.meta.env.DEV) {
      console.warn(`Invalid translation key${context ? ` in ${context}` : ''}:`, key);
    }
    return fallbackText;
  } catch (error) {
    const fallbackText = fallback || 'Translation Failed';
    if (import.meta.env.DEV) {
      console.error(`Translation error${context ? ` in ${context}` : ''}:`, error);
    }
    return fallbackText;
  }
};

// Safe nested key access for appContent
export const safeNestedTranslate = (
  t: (content: any) => string,
  contentObject: any,
  key: string,
  fallback?: string
): string => {
  try {
    const translationKey = contentObject?.[key];
    if (translationKey && typeof translationKey === 'object' && (translationKey.en || translationKey.ar)) {
      return t(translationKey);
    }
    
    // Create fallback translation object
    const fallbackText = fallback || key.charAt(0).toUpperCase() + key.slice(1);
    return t({ en: fallbackText, ar: fallbackText });
  } catch (error) {
    const fallbackText = fallback || key.charAt(0).toUpperCase() + key.slice(1);
    return t({ en: fallbackText, ar: fallbackText });
  }
};

// Hook for safe translation with context
export const useSafeTranslation = (context?: string) => {
  const { t, ...rest } = useTranslation();
  
  const safeT = (key: any, fallback?: string) => {
    return safeTranslate(t, key, fallback, context);
  };

  return {
    t: safeT,
    safeT,
    ...rest
  };
};

// Translation validation utility
export const validateTranslationKey = (key: any): boolean => {
  if (key === null || key === undefined) return false;
  if (typeof key === 'string') return true;
  if (typeof key === 'object' && (key.en || key.ar)) return true;
  return false;
};

// Create translation object helper
export const createTranslationKey = (en: string, ar: string) => ({
  en,
  ar
});

// Batch translation helper
export const translateMultiple = (
  t: (content: any) => string,
  keys: any[],
  fallbacks?: string[]
): string[] => {
  return keys.map((key, index) => {
    const fallback = fallbacks?.[index];
    return safeTranslate(t, key, fallback, 'batch translation');
  });
};

// Translation debugging helper
export const debugTranslation = (key: any, context?: string) => {
  if (!import.meta.env.DEV) return;
  
  console.group(`🌍 Translation Debug${context ? ` - ${context}` : ''}`);
  console.log('Key:', key);
  console.log('Type:', typeof key);
  console.log('Valid:', validateTranslationKey(key));
  
  if (typeof key === 'object') {
    console.log('English:', key?.en);
    console.log('Arabic:', key?.ar);
  }
  
  console.groupEnd();
};

// Translation cache for performance
const translationCache = new Map<string, string>();

export const cachedTranslate = (
  t: (content: any) => string,
  key: any,
  cacheKey?: string
): string => {
  // Only cache object translations
  if (typeof key !== 'object' || !key?.en) {
    return safeTranslate(t, key);
  }

  const cache_key = cacheKey || JSON.stringify(key);
  
  if (translationCache.has(cache_key)) {
    return translationCache.get(cache_key)!;
  }

  const translated = safeTranslate(t, key);
  translationCache.set(cache_key, translated);
  
  return translated;
};

// Clear translation cache
export const clearTranslationCache = () => {
  translationCache.clear();
};

// Translation statistics for debugging
export const getTranslationStats = () => {
  return {
    cacheSize: translationCache.size,
    cachedKeys: Array.from(translationCache.keys())
  };
};

// Enhanced translation component wrapper
export const withSafeTranslation = (Component: any, context?: string) => {
  return (props: any) => {
    const translation = useSafeTranslation(context);
    return React.createElement(Component, { ...props, translation });
  };
};

export default {
  safeTranslate,
  useSafeTranslation,
  validateTranslationKey,
  createTranslationKey,
  translateMultiple,
  debugTranslation,
  cachedTranslate,
  clearTranslationCache,
  getTranslationStats,
  withSafeTranslation
}; 