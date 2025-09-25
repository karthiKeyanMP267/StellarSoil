// languageService.js
// Lightweight translation & language detection helper to enable multilingual (Tamil/Hindi/English) chatbot flows.
// Uses @vitalets/google-translate-api which is already a dependency at the workspace root.
// Falls back gracefully if translation fails or package unavailable.

let translateApi; // undefined means not attempted yet (null means failed)
async function ensureTranslateLoaded() {
  if (translateApi !== undefined) return translateApi; // already loaded or failed
  try {
    const mod = await import('@vitalets/google-translate-api');
    // Handle different possible export shapes gracefully
    if (typeof mod === 'function') {
      translateApi = mod; // CJS default export style
    } else if (mod && typeof mod.default === 'function') {
      translateApi = mod.default; // ESM default
    } else if (mod && typeof mod.translate === 'function') {
      translateApi = mod.translate; // Named export fallback
    } else {
      console.warn('[languageService] Unexpected translate module shape, disabling translation. Keys:', Object.keys(mod||{}));
      translateApi = null;
    }
  } catch (e) {
    translateApi = null;
    console.warn('[languageService] Translation package not available, multilingual support degraded:', e.message);
  }
  return translateApi;
}

// Map of common language codes we explicitly support
const SUPPORTED_LANGS = new Set(['en', 'ta', 'hi']);

// Normalize certain regional / script variants to base codes
function normalizeLangCode(code = '') {
  const lower = code.toLowerCase();
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('ta')) return 'ta'; // Tamil
  if (lower.startsWith('hi')) return 'hi'; // Hindi
  return lower.split('-')[0];
}

async function detectAndTranslateToEnglish(text) {
  if (!text || typeof text !== 'string') {
    return { detectedLanguage: 'en', translatedText: text };
  }
  await ensureTranslateLoaded();
  if (!translateApi) return { detectedLanguage: 'en', translatedText: text };
  try {
    const res = await translateApi(text, { to: 'en' });
    const detectedLanguage = normalizeLangCode(res?.from?.language?.iso || 'en');
    // If detected English or unsupported, keep original
    if (detectedLanguage === 'en') {
      return { detectedLanguage: 'en', translatedText: text };
    }
    return { detectedLanguage, translatedText: res.text };
  } catch (e) {
    console.warn('[languageService] detect/translate failed:', e.message);
    return { detectedLanguage: 'en', translatedText: text };
  }
}

async function translateFromEnglish(text, targetLang) {
  if (!text) return text;
  if (!targetLang || targetLang === 'en') return text;
  if (!SUPPORTED_LANGS.has(targetLang)) return text; // Only translate explicitly supported languages
  await ensureTranslateLoaded();
  if (!translateApi) return text;
  try {
    const res = await translateApi(text, { to: targetLang });
    return res.text;
  } catch (e) {
    console.warn('[languageService] outbound translate failed:', e.message);
    return text; // Fallback to English
  }
}

// Translate an array of action button labels
async function translateActions(actions = [], targetLang) {
  if (!Array.isArray(actions) || actions.length === 0) return actions;
  return Promise.all(actions.map(a => translateFromEnglish(a, targetLang)));
}

export default {
  detectAndTranslateToEnglish,
  translateFromEnglish,
  translateActions,
  SUPPORTED_LANGS
};
