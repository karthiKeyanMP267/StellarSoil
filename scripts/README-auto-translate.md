# Auto Translate i18n Script

## Usage
1. Install dependencies:
   ```sh
   npm install @vitalets/google-translate-api
   ```
2. Run the script:
   ```sh
   node scripts/auto_translate_i18n.js
   ```
3. The script will auto-translate missing keys in `client/src/i18n/i18n.js` for Spanish, Hindi, and Tamil using Google Translate.

## Safety Notes
- **For development only!**
- Machine translation may be inaccurate or contextually wrong. Always review translations before using in production.
- This script updates your i18n.js file directly. Commit and backup your original file before running.
- You can add more languages by editing the `targetLangs` array in the script.

## Customization
- To add more languages, update `targetLangs` in `auto_translate_i18n.js`.
- To change the base language, update `baseLang` in the script.

---
**Do not use auto-generated translations in production without review!**
