// Translation Service - Integrates LibreTranslate API with existing Intlayer system
export interface TranslationOptions {
  source?: string;
  target: string;
  format?: 'text' | 'html';
  alternatives?: number;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
  alternatives?: string[];
}

class TranslationService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'https://libretranslate.com', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Translate dynamic content using LibreTranslate API
   */
  async translateContent(
    text: string, 
    options: TranslationOptions
  ): Promise<TranslationResponse> {
    try {
      const requestBody = {
        q: text,
        source: options.source || 'auto',
        target: options.target,
        format: options.format || 'text',
        ...(options.alternatives && { alternatives: options.alternatives }),
        ...(this.apiKey && { api_key: this.apiKey })
      };

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  /**
   * Translate batch content
   */
  async translateBatch(
    texts: string[], 
    options: TranslationOptions
  ): Promise<TranslationResponse> {
    try {
      const requestBody = {
        q: texts,
        source: options.source || 'auto',
        target: options.target,
        format: options.format || 'text',
        ...(this.apiKey && { api_key: this.apiKey })
      };

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Batch translation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Batch translation error:', error);
      throw error;
    }
  }

  /**
   * Get available languages
   */
  async getLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          ...(this.apiKey && { api_key: this.apiKey })
        }),
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result[0]; // Returns first detection result
    } catch (error) {
      console.error('Language detection error:', error);
      throw error;
    }
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Set base URL for self-hosted instances
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

// Create singleton instance
export const translationService = new TranslationService();

// Export for easy use
export default translationService; 