import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Dimensions 
} from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import Purchases, { PurchasesOffering, PurchasesPackage,CustomerInfo } from 'react-native-purchases';
import { useRevenueCatSubscription } from '@/redux/useRevenueCatSubscription';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { width } = Dimensions.get('window');

const Subscription = () => {


  const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<'Monthly' | 'Annual'>('Monthly');
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  
  const [isConfigured, setIsConfigured] = useState(false);
  useRevenueCatSubscription();

  const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     Purchases.configure({ apiKey: "goog_rPIGZgxzaDbtyLaJzGZLPsnMyjR" });
  //   }
  //   fetchOfferings();
  // }, []);


  // useSubscription(isConfigured);

  // const { isPremium } = useSelector((state: RootState) => state.subscription);

  useEffect(() => {
    // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: "goog_rPIGZgxzaDbtyLaJzGZLPsnMyjR" });
      setIsConfigured(true); // RevenueCat configuré
    }

    fetchOfferings();
    getCustomerInfo();
  }, []);

    const [isSubscribed, setIsSubscribed] = useState(false);

async function getCustomerInfo() {
  const customerInfo = await Purchases.getCustomerInfo();
  console.log(customerInfo);
    const fetchCustomerInfo = async () => {
      try {
        const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();

        // Vérifie si un abonnement actif existe
        const entitlements = customerInfo.entitlements.active;

        if (entitlements && Object.keys(entitlements).length > 0) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (e) {
        console.log("Erreur récupération customer info", e);
      }
    };

    fetchCustomerInfo();
}
  console.log('Is Subscribed:', isSubscribed);
  console.log('Is Premium:', isPremium);
  // Initialise RevenueCat
  // useEffect(() => {
  //   Purchases.configure({ apiKey: "goog_rPIGZgxzaDbtyLaJzGZLPsnMyjR" });
  //   fetchOfferings();
  // }, []);

  const fetchOfferings = async () => {
    try {
      const offerData = await Purchases.getOfferings();
      if (offerData.current) {
        setOfferings(offerData.current);
      }
    } catch (e) {
      console.log("Erreur fetching offerings:", e);
      console.log('Offerings', JSON.stringify(offerings, null, 2))
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      const purchase = await Purchases.purchasePackage(pkg);
      Alert.alert("Succès", "Votre abonnement a été activé !");
      console.log("Purchase success:", purchase);
    } catch (e: any) {
      if (!e.userCancelled) {
        console.log("Erreur achat:", e);
        Alert.alert("Erreur", "L'achat a échoué, réessayez.");
      }
    }
  };

  const getSelectedPackage = () => {
    if (!offerings) return null;
    if (selectedPlan === 'Monthly') return offerings.monthly;
    if (selectedPlan === 'Annual') return offerings.annual;
    return null;
  };

  const selectedPackage = getSelectedPackage();

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/icon/crown.png')}
          style={[styles.crown, { tintColor: "#FFD700" }]}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.black }]}>
          Passez au Premium et boostez votre nutrition
        </Text>
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

{offerings && offerings.availablePackages.map((pkg) => (
  <PlanOption
    key={pkg.identifier}
    selected={selectedPackage?.identifier === pkg.identifier}
    onPress={() => setSelectedPlan(pkg.identifier)}
    title={pkg.product.title}
    price={pkg.product.priceString}
    description={pkg.product.description}
  />
))}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (selectedPackage) handlePurchase(selectedPackage);
            else Alert.alert("Erreur", "Produit non disponible pour le moment.");
          }}
        >
          <Text style={[styles.buttonText, { color: colors.whiteFix }]}>S'abonner</Text>
        </TouchableOpacity>
      </View>

      <View>
      {isPremium ? <Text>Contenu premium débloqué ✅</Text> : <Text>Abonnez-vous pour accéder</Text>}
    </View>
    </ScrollView>
  );
};

const Feature = ({ emoji, title, desc }: { emoji: string; title: string; desc: string }) => (
  <View style={styles.feature}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const PlanOption = ({ selected, onPress, label, title, price, description }: any) => (
  <TouchableOpacity
    style={[styles.option, selected && styles.selectedOption]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {label && <View style={styles.labelContainer}><Text style={styles.label}>{label}</Text></View>}
    <View style={styles.optionContent}>
      <View>
        <Text style={styles.optionTitle}>{title}</Text>
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
  crown: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
  features: { width: '100%', marginBottom: 30 },
  feature: { flexDirection: 'row', marginBottom: 18, alignItems: 'center' },
  featureEmoji: { fontSize: 28, marginRight: 12 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  featureDesc: { fontSize: 14, color: '#666' },
  chooseText: { fontWeight: '700', fontSize: 18, marginBottom: 15, alignSelf: 'flex-start' },
  option: { backgroundColor: '#F4F0FF', borderRadius: 12, padding: 20, marginBottom: 18, width: width - 50, borderWidth: 2, borderColor: 'transparent' },
  selectedOption: { borderColor: '#6E42C1', backgroundColor: '#E6DFFF' },
  labelContainer: { position: 'absolute', top: 10, right: 15, backgroundColor: '#6E42C1', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, zIndex: 10 },
  label: { color: 'white', fontWeight: '700', fontSize: 12 },
  optionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionTitle: { fontSize: 18, fontWeight: 'bold', color: '#3B0D74' },
  price: { fontSize: 20, fontWeight: '900', color: '#6E42C1', marginTop: 2 },
  optionDesc: { fontSize: 14, color: '#444', maxWidth: 130, textAlign: 'right' },
  button: { marginTop: 20, width: width - 50, paddingVertical: 15, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  buttonText: { fontSize: 18, fontWeight: '900' },
});

export default Subscription;