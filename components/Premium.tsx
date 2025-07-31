import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function PremiumOverlayWrapper({ children, showOverlay }) {
  return (
    <View style={styles.container}>
      {children}

      {showOverlay && (
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={100} tint="dark" style={styles.blurOverlay} />
          <View style={styles.darkOverlay} />

          <Image
            source={require('@/assets/images/icon/crown.png')}
            style={styles.crown}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
darkOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // ou 0.8, 0.9 pour plus d'opacité
},
crown: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 60,
  height: 60,
  marginLeft: -30,  // moitié largeur négative pour décaler vers la gauche
  marginTop: -30,   // moitié hauteur négative pour décaler vers le haut
  zIndex: 10,
  tintColor: 'yellow'
},
});
