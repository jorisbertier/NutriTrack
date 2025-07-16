import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import fr from './fr.json';
import es from './es.json';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3', // Expo sdk 49+ recommandation
        // lng: Localization.locale.split('-')[0], // langue initiale en fonction du device (ex: 'fr', 'en')
        fallbackLng: 'en',
        resources: {
        en: { translation: en },
        fr: { translation: fr },
        es: { translation: es },
        },
        interpolation: {
        escapeValue: false, // React fait déjà l’échappement
        },
    });
    
export default i18n;