// API Integration Service for Creo ERP
// Leveraging public APIs from https://apivault.dev/ for enhanced functionality

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface MarketData {
  averagePrice: number;
  pricePerSqFt: number;
  marketTrend: 'up' | 'down' | 'stable';
  comparableProperties: {
    address: string;
    price: number;
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    soldDate: string;
  }[];
}

interface EmailValidation {
  isValid: boolean;
  isDisposable: boolean;
  domain: string;
  suggestion?: string;
}

interface PhoneValidation {
  isValid: boolean;
  country: string;
  carrier: string;
  lineType: 'mobile' | 'landline' | 'voip';
  formatted: string;
}

interface DocumentOCR {
  text: string;
  confidence: number;
  entities: {
    type: 'person' | 'address' | 'date' | 'amount' | 'organization';
    value: string;
    confidence: number;
  }[];
}

interface CurrencyConversion {
  from: string;
  to: string;
  rate: number;
  amount: number;
  converted: number;
  timestamp: Date;
}

interface NewsData {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: 'real-estate' | 'market' | 'finance' | 'local';
}

class ApiIntegrationService {
  private baseUrl = 'https://api.apivault.dev';
  private apiKey = 'demo-key';

  // Weather API Integration
  async getWeatherForProperty(latitude: number, longitude: number): Promise<ApiResponse<WeatherData>> {
    try {
      // Mock implementation for demo
      const mockWeather: WeatherData = {
        temperature: 72,
        condition: 'Sunny',
        humidity: 45,
        windSpeed: 8,
        forecast: [
          { date: '2024-12-13', high: 75, low: 62, condition: 'Partly Cloudy' },
          { date: '2024-12-14', high: 73, low: 60, condition: 'Sunny' },
          { date: '2024-12-15', high: 70, low: 58, condition: 'Cloudy' }
        ]
      };
      
      return {
        success: true,
        data: mockWeather
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Weather API failed'
      };
    }
  }

  // Geocoding API Integration
  async geocodeAddress(address: string): Promise<ApiResponse<LocationData>> {
    try {
      // Mock implementation
      const mockLocation: LocationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        address: address,
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      };
      
      return {
        success: true,
        data: mockLocation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Geocoding failed'
      };
    }
  }

  // Email Validation API
  async validateEmail(email: string): Promise<ApiResponse<EmailValidation>> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      const domain = email.split('@')[1];
      const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
      
      return {
        success: true,
        data: {
          isValid,
          isDisposable: disposableDomains.includes(domain),
          domain,
          suggestion: !isValid && email.includes('gmial') ? email.replace('gmial', 'gmail') : undefined
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email validation failed'
      };
    }
  }

  // Phone Validation API
  async validatePhone(phone: string): Promise<ApiResponse<PhoneValidation>> {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const isValid = cleanPhone.length >= 10;
      
      return {
        success: true,
        data: {
          isValid,
          country: 'US',
          carrier: 'Unknown',
          lineType: 'mobile',
          formatted: isValid ? `+1 (${cleanPhone.slice(-10, -7)}) ${cleanPhone.slice(-7, -4)}-${cleanPhone.slice(-4)}` : phone
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Phone validation failed'
      };
    }
  }

  // OCR API for Document Processing
  async processDocumentOCR(imageBase64: string): Promise<ApiResponse<DocumentOCR>> {
    try {
      const mockText = `
        PURCHASE AGREEMENT
        
        Buyer: John Smith
        Seller: Jane Doe
        Property Address: 123 Oak Street, Downtown, NY 10001
        Purchase Price: $450,000
        Closing Date: December 25, 2024
        
        This agreement is binding upon execution by both parties.
      `;

      const entities = [
        { type: 'person' as const, value: 'John Smith', confidence: 0.95 },
        { type: 'person' as const, value: 'Jane Doe', confidence: 0.93 },
        { type: 'address' as const, value: '123 Oak Street, Downtown, NY 10001', confidence: 0.98 },
        { type: 'amount' as const, value: '$450,000', confidence: 0.97 },
        { type: 'date' as const, value: 'December 25, 2024', confidence: 0.92 }
      ];

      return {
        success: true,
        data: {
          text: mockText.trim(),
          confidence: 0.94,
          entities
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR processing failed'
      };
    }
  }

  // Currency Conversion API
  async convertCurrency(amount: number, from: string, to: string): Promise<ApiResponse<CurrencyConversion>> {
    try {
      // Using a free currency API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );

      if (!response.ok) {
        throw new Error(`Currency API error: ${response.status}`);
      }

      const data = await response.json();
      const rate = data.rates[to];
      
      if (!rate) {
        throw new Error(`Currency ${to} not supported`);
      }

      return {
        success: true,
        data: {
          from,
          to,
          rate,
          amount,
          converted: amount * rate,
          timestamp: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Currency conversion failed'
      };
    }
  }

  // Real Estate News API
  async getRealEstateNews(location?: string): Promise<ApiResponse<NewsData[]>> {
    try {
      // Mock implementation - in real app would use NewsAPI or similar
      const mockNews: NewsData[] = [
        {
          title: 'Housing Market Shows Strong Growth in Q4 2024',
          description: 'Real estate prices continue to rise with increased demand and limited inventory.',
          url: 'https://example.com/news/1',
          source: 'Real Estate Weekly',
          publishedAt: new Date(2024, 11, 10),
          category: 'market'
        },
        {
          title: 'New Construction Projects Approved Downtown',
          description: 'City council approves three new residential developments in the downtown area.',
          url: 'https://example.com/news/2',
          source: 'Local News',
          publishedAt: new Date(2024, 11, 9),
          category: 'local'
        },
        {
          title: 'Interest Rates Expected to Stabilize',
          description: 'Federal Reserve signals potential pause in rate adjustments for 2025.',
          url: 'https://example.com/news/3',
          source: 'Financial Times',
          publishedAt: new Date(2024, 11, 8),
          category: 'finance'
        }
      ];

      return {
        success: true,
        data: mockNews
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'News API failed'
      };
    }
  }

  // Market Data API
  async getMarketData(zipCode: string): Promise<ApiResponse<MarketData>> {
    try {
      const mockData: MarketData = {
        averagePrice: 425000,
        pricePerSqFt: 285,
        marketTrend: 'up',
        comparableProperties: [
          {
            address: '125 Oak Street',
            price: 435000,
            sqft: 1520,
            bedrooms: 3,
            bathrooms: 2,
            soldDate: '2024-11-15'
          },
          {
            address: '127 Oak Street',
            price: 415000,
            sqft: 1480,
            bedrooms: 3,
            bathrooms: 2,
            soldDate: '2024-11-10'
          }
        ]
      };

      return {
        success: true,
        data: mockData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Market data API failed'
      };
    }
  }

  // QR Code Generation API
  async generateQRCode(data: string, size: number = 200): Promise<ApiResponse<string>> {
    try {
      const encodedData = encodeURIComponent(data);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
      
      return {
        success: true,
        data: qrUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'QR code generation failed'
      };
    }
  }

  // Text Analysis API for Sentiment Analysis
  async analyzeSentiment(text: string): Promise<ApiResponse<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number }>> {
    try {
      const positiveWords = ['excellent', 'great', 'good', 'amazing', 'wonderful', 'perfect', 'love', 'beautiful'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disgusting', 'worst', 'ugly'];
      
      const words = text.toLowerCase().split(/\s+/);
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
        if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
      });
      
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      let confidence = 0.5;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        confidence = Math.min(0.9, 0.5 + (positiveCount - negativeCount) * 0.1);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        confidence = Math.min(0.9, 0.5 + (negativeCount - positiveCount) * 0.1);
      }

      return {
        success: true,
        data: { sentiment, confidence }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sentiment analysis failed'
      };
    }
  }

  // Email Sending API
  async sendEmail(to: string, subject: string, body: string, isHtml: boolean = false): Promise<ApiResponse<{ messageId: string }>> {
    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: { messageId }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed'
      };
    }
  }

  // SMS Sending API
  async sendSMS(to: string, message: string): Promise<ApiResponse<{ messageId: string }>> {
    try {
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        data: { messageId }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SMS sending failed'
      };
    }
  }

  // Image Optimization API
  async optimizeImage(imageUrl: string, width?: number, height?: number, quality?: number): Promise<ApiResponse<string>> {
    try {
      // Using a free image optimization service
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      if (quality) params.append('q', quality.toString());
      
      const optimizedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&${params.toString()}`;
      
      return {
        success: true,
        data: optimizedUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image optimization failed'
      };
    }
  }
}

export const apiService = new ApiIntegrationService();
export type { 
  ApiResponse, 
  WeatherData, 
  LocationData, 
  MarketData, 
  EmailValidation, 
  PhoneValidation, 
  DocumentOCR, 
  CurrencyConversion, 
  NewsData 
}; 