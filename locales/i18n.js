import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import fr from './fr.json';
import es from './es.json';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        try {
        const savedLang = await AsyncStorage.getItem('user-language');
         console.log('🔍 Langue enregistrée dans AsyncStorage:', savedLang);
        if (savedLang) {
            callback(savedLang);
        } else {
            // Par défaut on prend la langue du device (ex: 'fr' de fr-FR)
            const deviceLang = Localization.locale.split('-')[0];
             console.log('📱 Langue du téléphone détectée:', deviceLang);
            callback(deviceLang);
        }
        } catch (e) {
        callback('en'); // fallback si erreur
          console.log('❌ Erreur de détection de langue:', e);
        }
    },
    init: () => {},
    cacheUserLanguage: async (lng) => {
        try {
        await AsyncStorage.setItem('user-language', lng);
          console.log('💾 Langue sauvegardée:', lng);
        } catch (e) {
        // erreur ignore
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        fallbackLng: 'en',
        resources: {
        en: { translation: en },
        fr: { translation: fr },
        es: { translation: es },
        },
        interpolation: {
        escapeValue: false,
        },
});

export default i18n;