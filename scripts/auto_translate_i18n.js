// Auto-translate i18n keys using Google Translate API
// Usage: node scripts/auto_translate_i18n.js
// Requires: npm install @vitalets/google-translate-api

const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api');

const i18nPath = path.join(__dirname, '../client/src/i18n/i18n.js');
const targetLangs = ['es', 'hi', 'ta']; // Add more language codes as needed
const baseLang = 'en';

function flatten(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flatten(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

function unflatten(data) {
  const result = {};
  for (const i in data) {
    const keys = i.split('.');
    keys.reduce((r, e, j) => {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? data[i] : {}) : []);
    }, result);
  }
  return result;
}

async function autoTranslate() {
  let src = fs.readFileSync(i18nPath, 'utf8');
  let resourcesMatch = src.match(/const resources = ([\s\S]*?);\n/);
  if (!resourcesMatch) throw new Error('resources object not found');
  let resources = eval('(' + resourcesMatch[1] + ')');
  const base = flatten(resources[baseLang].translation);

  for (const lang of targetLangs) {
    if (!resources[lang]) resources[lang] = { translation: {} };
    let target = flatten(resources[lang].translation);
    for (const key in base) {
      if (!target[key]) {
        try {
          const res = await translate(base[key], { to: lang });
          target[key] = res.text;
          console.log(`[${lang}] ${key}: ${res.text}`);
        } catch (e) {
          console.error(`Error translating ${key} to ${lang}:`, e.message);
        }
      }
    }
    resources[lang].translation = unflatten(target);
  }

// Replace resources in file
const newResources = 'const resources = ' + JSON.stringify(resources, null, 2) + ';\n';
src = src.replace(/const resources = ([\s\S]*?);\n/, newResources);
fs.writeFileSync(i18nPath, src, 'utf8');
console.log('i18n.js updated with auto-translations.');
}

autoTranslate();
