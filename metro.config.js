// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Extensions déjà gérées
defaultConfig.resolver.sourceExts.push('cjs');

// ✅ Ajout du support pour les fichiers .riv
defaultConfig.resolver.assetExts = [
  ...(defaultConfig.resolver.assetExts || []),
  'riv',
];

module.exports = defaultConfig;