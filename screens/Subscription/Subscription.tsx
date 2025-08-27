import React, { useState, useEffect, use } from 'react';
import { Platform } from 'react-native';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Dimensions 
} from 'react-native';
import { useTheme } from '@/hooks/ThemeProvider';
import Purchases, { PurchasesOffering, PurchasesPackage,CustomerInfo } from 'react-native-purchases';
import { useRevenueCatSubscription } from '@/redux/useRevenueCatSubscription';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const Subscription = () => {
  
  const { colors } = useTheme();

  const { t } = useTranslation();

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
          console.log('entitlements number ', (entitlements).length)
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

  const fetchOfferings = async () => {
    try {
      const offerData = await Purchases.getOfferings();
      console.log('OfferData.current:', JSON.stringify(offerData.current, null, 2));
      if (offerData.current) {
                if (offerData.current.annual) {
                  console.log("Annual Package trouvé :", offerData.current.annual);
                } else {
        console.log('offerdata', offerData)
        console.log("Annual Package non disponible");
      }
    
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
        // console.log("Erreur achat:", e);
        // Alert.alert("Erreur", "L'achat a échoué, réessayez.");
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.gray}}>

      <View style={styles.container}>
        <Image
          source={require('@/assets/images/icon/crown.png')}
          style={[styles.crown, { tintColor: "#FFD700" }]}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.blackFix }]}>
          {t('goPremium')}
        </Text>

      <View style={{ backgroundColor: colors.whiteFix, width: '100%', gap: 10, borderRadius: 20, padding: 20}}>
        <View style={{flexDirection: 'row', gap: 20}}>
          <Image
            source={require('@/assets/images/verify2.png')}
            style={styles.image}
            resizeMode="cover"
            />
            <Text style={styles.text}>Create & Customize Your Foods</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20}}>
          <Image
            source={require('@/assets/images/verify2.png')}
            style={styles.image}
            resizeMode="cover"
            />
            <Text style={styles.text}>Access to All Macronutrients</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20}}>
          <Image
            source={require('@/assets/images/verify2.png')}
            style={styles.image}
            resizeMode="cover"
            />
            <Text style={styles.text}>Weight Tracking</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20}}>
          <Image
            source={require('@/assets/images/verify2.png')}
            style={styles.image}
            resizeMode="cover"
            />
            <Text style={styles.text}>No ads</Text>
        </View>
      </View>
        {/* <View style={styles.features}>
          <Feature emoji="🥗" title="Créer & personnaliser vos aliments" desc="Modifiez les quantités et les macros selon vos besoins." />
          <Feature emoji="🧬" title="Accès à tous les macronutriments" desc="Suivez précisément protéines, glucides, lipides, et plus." />
          <Feature emoji="🎯" title="Gestion avancée des objectifs" desc="Perdez, gagnez ou maintenez votre poids facilement." />
          <Feature emoji="📊" title="Suivi du poids" desc="Visualisez votre évolution pour rester motivé." />
          <Feature emoji="🚫" title="Zéro publicité" desc="Profitez d'une expérience fluide et sans interruption." />
        </View> */}

        <Text style={styles.chooseText}>Choisissez votre offre :</Text>

{offerings && (
  <>
    {offerings.monthly && (
      <PlanOption
        selected={selectedPlan === 'Monthly'}
        onPress={() => setSelectedPlan('Monthly')}
        title={offerings.monthly.product.title.replace(' (Nutri Track)', '')}
        price={offerings.monthly.product.priceString}
        description={offerings.monthly.product.description}
      />
    )}
    {offerings.annual && (
      <PlanOption
        selected={selectedPlan === 'Annual'}
        onPress={() => setSelectedPlan('Annual')}
        title={offerings.annual.product.title.replace(' (Nutri Track)', '')}
        price={offerings.annual.product.priceString}
        description={offerings.annual.product.description}
      />
    )}
  </>
)}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.blackFix }]}
          onPress={() => {
            if (selectedPackage) handlePurchase(selectedPackage);
            else Alert.alert("Erreur", "Produit non disponible pour le moment.");
          }}
        >
          <Text style={[styles.buttonText, { color: colors.whiteFix }]}>{t('subscribe')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// const Feature = ({ emoji, title, desc }: { emoji: string; title: string; desc: string }) => (
//   <View style={styles.feature}>
//     <Text style={styles.featureEmoji}>{emoji}</Text>
//     <View style={{ flex: 1 }}>
//       <Text style={styles.featureTitle}>{title}</Text>
//       <Text style={styles.featureDesc}>{desc}</Text>
//     </View>
//   </View>
// );


const PlanOption = ({ selected, onPress, label, title, price, description }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
console.log('selected', selected);
console.log(title, label)
  return (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: colors.whiteFix},
          selected && {borderColor: colors.blackFix, borderWidth: 1 }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      <View style={styles.optionContent}>
        <View>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.price}>{price} / {title === "Premium Monthly" ? `${t('month')}` : `year`}</Text>
        </View>
        <Text style={styles.optionDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
  },
  image : {height: 20,width: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, tintColor: 'black'},
  text : {fontSize: 16, fontWeight: 400},
  crown: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginVertical: 15 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
  features: { width: '100%', marginBottom: 30 },
  feature: { flexDirection: 'row', marginBottom: 18, alignItems: 'center' },
  featureEmoji: { fontSize: 28, marginRight: 12 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  featureDesc: { fontSize: 14, color: '#666' },
  chooseText: { fontWeight: '500', fontSize: 18, marginVertical: 15, alignSelf: 'flex-start' },
  option: {borderRadius: 20, padding: 20, marginBottom: 18, width: width - 50, borderWidth: 2, borderColor: 'transparent' },
  labelContainer: { position: 'absolute', top: 10, right: 15,paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, zIndex: 10 },
  label: { color: 'white', fontWeight: '500', fontSize: 12 },
  optionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionTitle: { fontSize: 18, fontWeight: '500'},
  price: { fontSize: 20, fontWeight: '400',marginTop: 2 },
  optionDesc: { fontSize: 14, color: '#444', maxWidth: 130, textAlign: 'right' },
  button: { marginTop: 20, width: width - 50, paddingVertical: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  buttonText: { fontSize: 18, fontWeight: '500' },
});

export default Subscription;