import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/ThemeProvider';

const { width } = Dimensions.get('window');

export default function PremiumOverlayWrapper({ children, showOverlay }) {

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {children}

     {showOverlay && (
      <View style={[StyleSheet.absoluteFill, styles.overlayContainer]}>
        <BlurView intensity={100} tint="dark" style={styles.blurOverlay} />
        <View style={styles.darkOverlay} />

        <Text style={[styles.text, { color: colors.whiteFix }]}>{t('soon')} ...</Text>
      </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 20,
    overflow: "hidden",
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: "hidden"
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20
  },
  text: {
    fontSize: 20,
    fontWeight: 500,
    textAlign: 'center',
  },
});
