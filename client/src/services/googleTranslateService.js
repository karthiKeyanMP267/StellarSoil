/**
 * Google Translate Integration Service
 * 
 * To use this service, you need to:
 * 1. Get a Google Translate API key from Google Cloud Console
 * 2. Set the API key in your environment variables as VITE_GOOGLE_TRANSLATE_API_KEY
 * 3. Enable the Google Translate API in your Google Cloud project
 */

class GoogleTranslateService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    this.cache = new Map();
  }

  /**
   * Initialize Google Translate widget (alternative to API)
   * This uses the free Google Translate widget
   */
  initializeWidget() {
    if (window.google && window.google.translate) {
      return;
    }

    // Add Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,hi,fr,de,zh-cn,ja,ko,ar,pt,ru,it,bn,ta,te,mr,gu,kn,ml,pa',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          autoDisplay: false,
          multilanguagePage: true
        },
        'google_translate_element'
      );
    };

    // Add styles to hide Google Translate branding
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value { display: none !important; }
      .goog-te-gadget-simple { display: none !important; }
      body { top: 0px !important; }
      .goog-te-combo { 
        background: linear-gradient(to right, #f9e6c8, #fcf1e0);
        border: 2px solid #d4a958;
        border-radius: 12px;
        padding: 8px 12px;
        font-size: 14px;
        color: #8f7138;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Translate text using Google Translate API
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'es', 'hi', 'fr')
   * @param {string} sourceLanguage - Source language code (default: 'en')
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Using fallback method.');
      return this.translateWithWidget(text, targetLanguage);
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Translate multiple texts at once
   * @param {Array<string>} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (default: 'en')
   * @returns {Promise<Array<string>>} Array of translated texts
   */
  async translateMultiple(texts, targetLanguage, sourceLanguage = 'en') {
    if (!this.apiKey) {
      console.warn('Google Translate API key not found.');
      return texts;
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations.map(translation => translation.translatedText);
    } catch (error) {
      console.error('Multiple translation error:', error);
      return texts;
    }
  }

  /**
   * Get list of supported languages
   * @returns {Promise<Array>} Array of supported language objects
   */
  async getSupportedLanguages() {
    if (!this.apiKey) {
      return this.getDefaultLanguages();
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/languages?key=${this.apiKey}&target=en`
      );

      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.languages;
    } catch (error) {
      console.error('Get languages error:', error);
      return this.getDefaultLanguages();
    }
  }

  /**
   * Fallback method using Google Translate widget
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   */
  translateWithWidget(text, targetLanguage) {
    // This is a simplified fallback - in a real implementation,
    // you might want to use a different translation service
    console.log(`Translating "${text}" to ${targetLanguage} using widget`);
    return text;
  }

  /**
   * Default supported languages when API is not available
   */
  getDefaultLanguages() {
    return [
      { language: 'en', name: 'English' },
      { language: 'es', name: 'Spanish' },
      { language: 'hi', name: 'Hindi' },
      { language: 'fr', name: 'French' },
      { language: 'de', name: 'German' },
      { language: 'zh-cn', name: 'Chinese (Simplified)' },
      { language: 'ja', name: 'Japanese' },
      { language: 'ko', name: 'Korean' },
      { language: 'ar', name: 'Arabic' },
      { language: 'pt', name: 'Portuguese' },
      { language: 'ru', name: 'Russian' },
      { language: 'it', name: 'Italian' },
      { language: 'bn', name: 'Bengali' },
      { language: 'ta', name: 'Tamil' },
      { language: 'te', name: 'Telugu' },
      { language: 'mr', name: 'Marathi' },
      { language: 'gu', name: 'Gujarati' },
      { language: 'kn', name: 'Kannada' },
      { language: 'ml', name: 'Malayalam' },
      { language: 'pa', name: 'Punjabi' }
    ];
  }

  /**
   * Auto-detect language of given text
   * @param {string} text - Text to detect language for
   * @returns {Promise<string>} Detected language code
   */
  async detectLanguage(text) {
    if (!this.apiKey) {
      return 'en'; // Default to English
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Detection API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize() {
    return this.cache.size;
  }
}

// Create and export a singleton instance
const googleTranslateService = new GoogleTranslateService();

export default googleTranslateService;

/**
 * HOW TO SET UP GOOGLE TRANSLATE API:
 * 
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select an existing one
 * 3. Enable the Google Translate API:
 *    - Go to "APIs & Services" > "Library"
 *    - Search for "Cloud Translation API"
 *    - Click on it and enable it
 * 
 * 4. Create API credentials:
 *    - Go to "APIs & Services" > "Credentials"
 *    - Click "Create Credentials" > "API Key"
 *    - Copy the generated API key
 * 
 * 5. Add the API key to your environment:
 *    - Create a .env file in your client folder if it doesn't exist
 *    - Add: VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
 * 
 * 6. Optional: Restrict the API key:
 *    - In the credentials page, click on your API key
 *    - Under "API restrictions", select "Restrict key"
 *    - Choose "Cloud Translation API"
 *    - Under "Application restrictions", you can restrict by HTTP referrers
 * 
 * 7. Set up billing (required for API usage):
 *    - Go to "Billing" in the console
 *    - Add a payment method
 *    - Note: Google provides $300 in free credits for new accounts
 * 
 * PRICING (as of 2024):
 * - $20 per million characters translated
 * - First 500,000 characters per month are free
 * 
 * ALTERNATIVE: Use the free Google Translate widget (limited functionality)
 * - The service includes a widget-based fallback
 * - No API key required, but less control and customization
 */
