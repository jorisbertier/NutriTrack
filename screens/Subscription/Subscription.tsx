import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Pressable, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const Subscription = () => {
    const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState('Annual');
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);

  const handleSubscription = () => setIsWebViewVisible(true);
  const closeWebView = () => setIsWebViewVisible(false);

  return (
    <ScrollView>
        <View style={styles.container}>
      <Image
        source={require('@/assets/images/icon/crown.png')}
        style={[styles.crown, { tintColor: "#FFD700"}]}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.black}]}>Passez au Premium et boostez votre nutrition</Text>
      <Text style={styles.subtitle}>
        Sans pub, accès complet aux fonctionnalités avancées, et un suivi précis adapté à vos objectifs.
      </Text>

      <View style={styles.features}>
        <Feature emoji="🥗" title="Créer & personnaliser vos aliments" desc="Modifiez les quantités et les macros selon vos besoins." />
        <Feature emoji="🧬" title="Accès à tous les macronutriments" desc="Suivez précisément protéines, glucides, lipides, et plus." />
        <Feature emoji="🎯" title="Gestion avancée des objectifs" desc="Perdez, gagnez ou maintenez votre poids facilement." />
        <Feature emoji="📊" title="Suivi du poids" desc="Visualisez votre évolution pour rester motivé." />
        <Feature emoji="🚫" title="Zéro publicité" desc="Profitez d'une expérience fluide et sans interruption." />
      </View>

      <Text style={styles.chooseText}>Choisissez votre offre :</Text>

      <PlanOption
        selected={selectedPlan === 'Annual'}
        onPress={() => setSelectedPlan('Annual')}
        label="Économisez 68%"
        title="Offre annuelle"
        oldPrice="72€"
        price="21,48€"
        description="1,79€/mois, facturation annuelle"
      />
      <PlanOption
        selected={selectedPlan === 'Monthly'}
        onPress={() => setSelectedPlan('Monthly')}
        title="Offre mensuelle"
        price="6€ / mois"
        description="Résiliable à tout moment"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSubscription}
      >
        <Text style={[styles.buttonText, { color: colors.whiteFix }]}>S'abonner</Text>
      </TouchableOpacity>

      <Modal visible={isWebViewVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable style={styles.closeButton} onPress={closeWebView}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
          <WebView
            source={{
              uri:
                selectedPlan === 'Annual'
                  ? 'https://buy.stripe.com/test_00gcPz6YGdZzcjS6op'
                  : 'https://buy.stripe.com/test_fZe5n70Ai4oZabK9AA',
            }}
            startInLoadingState
          />
        </View>
      </Modal>
      </View>
    </ScrollView>
  );
};

const Feature = ({ emoji, title, desc }) => (
  <View style={styles.feature}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const PlanOption = ({ selected, onPress, label, title, oldPrice, price, description }) => (
  <TouchableOpacity
    style={[styles.option, selected && styles.selectedOption]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {label && <View style={styles.labelContainer}><Text style={styles.label}>{label}</Text></View>}
    <View style={styles.optionContent}>
      <View>
        <Text style={styles.optionTitle}>{title}</Text>
        {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
        <Text style={styles.price}>{price}</Text>
      </View>
      <Text style={styles.optionDesc}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
  },
  crown: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    color: '#3B0D74',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  features: {
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
  },
  chooseText: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15,
    color: '#3B0D74',
    alignSelf: 'flex-start',
  },
  option: {
    backgroundColor: '#F4F0FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    width: width - 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#6E42C1',
    backgroundColor: '#E6DFFF',
  },
  labelContainer: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: '#6E42C1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    zIndex: 10,
  },
  label: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B0D74',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    color: '#6E42C1',
    marginTop: 2,
  },
  optionDesc: {
    fontSize: 14,
    color: '#444',
    maxWidth: 130,
    textAlign: 'right',
  },
  button: {
    marginTop: 20,
    width: width - 50,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#3B0D74',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Subscription;
