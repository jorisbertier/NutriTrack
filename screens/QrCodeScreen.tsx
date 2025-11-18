import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Pressable, Alert, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity } from "react-native";
import ProgressBarFluid from "@/components/ProgressBarFluid";
import BottomInputBarQr from "@/components/Scan/QrBottomBar";
import { useTheme } from "@/hooks/ThemeProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  BasalMetabolicRate,
  calculAge,
  calculCarbohydrates,
  calculFats,
  calculProteins,
  fetchUserDataConnected,
  updateNutritionRedux,
} from "@/functions/function";
import { User } from "@/interface/User";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MotiView } from "moti";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QrCodeScreen({ route }) {

  const router = useRouter();
  const barcode = route?.params?.barcode;
  const routeDate = useRoute();
  const { date } = routeDate.params;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.user.user);
  

  type ProductInfo = {
    product_name?: string;
    generic_name?: string;
    image_url?: string;
    nutriments?: {
      [key: string]: number | string | undefined;
      "proteins_100g"?: number;
      "fat_100g"?: number;
      "carbohydrates_100g"?: number;
      "energy-kcal_100g"?: number;
      "sugars_100g"?: number;
      "saturated-fat_100g"?: number;
      "fiber_100g"?: number;
      "salt_100g"?: number;
      "sodium_100g"?: number;
    };
    error?: string;
  };

  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [quantityGrams, setQuantityGrams] = useState("100");
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [showNotification, setShowNotification] = useState(false);
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [loadingCreateAliment, setLoadingCreateAliment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [notifMessage, setNotifMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [userData, setUserData] = useState<User[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  

  useEffect(() => {
    fetchUserDataConnected(user, setUserData);
  }, []);

  const basalMetabolicRate =
    userData.length > 0
      ? BasalMetabolicRate(
          Number(userData[0]?.weight),
          Number(userData[0]?.height),
          Number(calculAge(userData[0]?.dateOfBirth)),
          userData[0]?.gender,
          userData[0]?.activityLevel
        )
      : 0;

  const proteinsGoal = calculProteins(Number(userData[0]?.weight)) || 0;
  const carbsGoal = calculCarbohydrates(basalMetabolicRate);
  const fatsGoal = calculFats(basalMetabolicRate);

  useEffect(() => {
    if (!barcode) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?lang=${i18n.language}`
        );
        const json = await res.json();
        if (json?.status === 1) setProductInfo(json.product);
        else setProductInfo({ error: "Produit non trouvé" });
      } catch (e) {
        setProductInfo({ error: "Erreur API" });
      }
    };
    fetchProduct();
  }, [barcode]);

  const isHealthy = () => {
    const sugar = productInfo?.nutriments?.["sugars_100g"] || 0;
    const fat = productInfo?.nutriments?.["fat_100g"] || 0;
    const saturated = productInfo?.nutriments?.["saturated-fat_100g"] || 0;
    return sugar <= 5 && fat <= 10 && saturated <= 5;
  };

  const getGenericName = (product: any, lang: string) => {
    if (!product) return '';

    switch (lang) {
      case 'en':
        return product.generic_name_en || product.product_name_en || '';
      case 'es':
        return product.generic_name_es || product.product_name_es || '';
      default:
        return product.generic_name || product.product_name || '';
    }
  };

  const formatNutrientValue = (
    nutrientValue: number | string | undefined,
    grams: number
  ) => {
    if (!nutrientValue) return 0;
    const valueNum = Number(nutrientValue);
    const adjusted = (valueNum * grams) / 100;
    return Math.round(adjusted * 10) / 10;
  };

  
  const generateManualId = () => {
      return `ID-${Date.now()}`;
  }

  const createAliment = async (event: any) => {
      event.preventDefault();

      try {
          const collectionRef = collection(firestore, "UserCreatedFoodsQr");

          // Récupérez tous les documents de la collection
          const querySnapshot = await getDocs(collectionRef);
      
          // Calculez le prochain ID en trouvant le plus grand ID existant
          let maxId = 0;
          querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.id && data.id > maxId) {
                  maxId = data.id;
              }
          });
      
          const newId = maxId + 1;
      
          const nutrientValues = {
            title: productInfo?.product_name,
            calories: formatNutrientValue(productInfo?.nutriments?.["energy-kcal_100g"], Number(quantityGrams)),
            proteins: formatNutrientValue(productInfo?.nutriments?.["proteins_100g"], Number(quantityGrams)),
            carbs: formatNutrientValue(productInfo?.nutriments?.["carbohydrates_100g"], Number(quantityGrams)),
            fats: formatNutrientValue(productInfo?.nutriments?.["fat_100g"], Number(quantityGrams)),
            sugar: formatNutrientValue(productInfo?.nutriments?.["sugars_100g"], Number(quantityGrams)),
            quantity: quantityGrams, 
            unit: productInfo?.product_quantity_unit || 'g',
            date: date,
            mealType: selectedMealType,
            image: productInfo?.image_url
          };

          Object.keys(nutrientValues).forEach((key) => {
            //@ts-ignore
              if (nutrientValues[key] === null || nutrientValues[key] === undefined || nutrientValues[key] === '') {
                //@ts-ignore
                  delete nutrientValues[key];
              }
          });

          await setDoc(doc(firestore, "UserCreatedFoodsQr",  generateManualId()), {
              id: newId,
              idUser: userData[0]?.id,
              ...nutrientValues
          });

          updateNutritionRedux(dispatch, userRedux, date, {
            calories: nutrientValues.calories,
            proteins: nutrientValues.proteins,
            carbs: nutrientValues.carbs,
            fats: nutrientValues.fats,
          });

          setLoadingCreateAliment(true);
          setTimeout(() => setLoadingCreateAliment(false), 2400);
          setTimeout(() => {
            //@ts-ignore
            navigation.pop(2);
          }, 2400);
      } catch(error: any) {
          console.log('Create an aliment error', error.message);
            Alert.alert(
              "Erreur",
              "Impossible d'ajouter cet aliment. Veuillez réessayer plus tard.",
              [{ text: "OK", style: "default" }]
            );
      }
  }

  // Fonction toggle
  const toggleAliment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (!liked) {
        // -------- AJOUT --------
        const collectionRef = collection(firestore, "UserCreatedFoods");
        const querySnapshot = await getDocs(collectionRef);

        let maxId = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.id && data.id > maxId) {
            maxId = data.id;
          }
        });

        const newId = maxId + 1;

        const dataToSave = {
          title: productInfo?.product_name,
          quantity: quantityGrams,
          unit: productInfo?.product_quantity_unit || "g",
          calories: formatNutrientValue(productInfo?.nutriments?.["energy-kcal_100g"], Number(quantityGrams)),
          proteins: formatNutrientValue(productInfo?.nutriments?.["proteins_100g"], Number(quantityGrams)),
          carbohydrates: formatNutrientValue(productInfo?.nutriments?.["carbohydrates_100g"], Number(quantityGrams)),
          fats: formatNutrientValue(productInfo?.nutriments?.["fat_100g"], Number(quantityGrams)),
          sugar: formatNutrientValue(productInfo?.nutriments?.["sugars_100g"], Number(quantityGrams)),
          image: productInfo?.image_url,
          idUser: userData[0]?.id,
        };

        const docId = generateManualId();
        await setDoc(doc(firestore, "UserCreatedFoods", docId), {
          id: newId,
          ...dataToSave,
        });

        setSavedDocId(docId);
        setLiked(true);

        setNotifMessage("a bien été ajouté à la liste");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          setIsProcessing(false);
        }, 2500);

        console.log("aliment ajouté")
      } else {
        // -------- SUPPRESSION --------
        if (!savedDocId) return;

        const docRef = doc(firestore, "UserCreatedFoods", savedDocId);
        await deleteDoc(docRef);

        setSavedDocId(null);
        setLiked(false);

        setNotifMessage("a bien été supprimé de la liste");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          setIsProcessing(false);
        }, 2500);
        console.log("aliment supprimé")
      }
    } catch (error: any) {
      console.log("Toggle aliment error:", error.message);
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={{flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 20, alignItems: 'center'}}>
        <Pressable onPress={() => router.back() } style={{ padding: 16, marginTop: 20 }}>
          <Image source={require('@/assets/images/back.png')} style={styles.icon} />
        </Pressable>
        {!productInfo?.error && (
          <Pressable onPress={toggleAliment} disabled={isProcessing}>
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: liked ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 200 }}
                  style={{
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              top: 12,
              opacity: isProcessing ? 0.5 : 1,
            }}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={25}
                color={liked ? colors.blue : "black"}
              />
            </MotiView>
          </Pressable>
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        {!productInfo ? (
          <ActivityIndicator size="large" color={colors.black} />
        ) : productInfo.error ? (
              <View style={styles.errorContainer}>

        <Text style={styles.errorTitle}>{t('productTitle')}</Text>
        <Text style={styles.errorMessage}>
            {t('productText')}
        </Text>
        <Text style={styles.errorMessage}>
            {t('tryAgain')}
        </Text>
        <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.black}]}
            //@ts-ignore
            onPress={() => navigation.pop(1)}
        >
            <Text style={[styles.retryButtonText, { color: colors.white}]}>{t('rescan')}</Text>
        </TouchableOpacity>
    </View>
        ) : (
          <>
            {productInfo.image_url && (
              <View
                style={[styles.containerImage, { backgroundColor: colors.gray }]}
              >
                <Image
                  source={{ uri: productInfo.image_url }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.details}>
                  <Text style={[styles.title, { color: colors.blackFix }]}>
                    {productInfo.product_name}
                  </Text>

                  <View style={styles.nutrients}>
                    <View
                      style={[
                        styles.nutrientItem,
                        { backgroundColor: "rgba(0,170,255,0.1)" },
                      ]}
                    >
                      {/* <Ionicons name="fast-food-outline" size={16} color="#00aaff" /> */}
                      <Image source={require('@/assets/images/nutritional/protein.png')} style={{width: 14, height: 14}}/>
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(productInfo.nutriments?.["proteins_100g"], Number(quantityGrams)) + " g"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.nutrientItem,
                        { backgroundColor: "rgba(244,162,97,0.1)" },
                      ]}
                    >
                      {/* <Ionicons name="egg-outline" size={16} color="#f4a261" /> */}
                      <Image source={require('@/assets/images/nutritional/house.png')} style={{width: 14, height: 14}}/>
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(
                          productInfo.nutriments?.["fat_100g"],
                          Number(quantityGrams)
                        ) + " g"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.nutrientItem,
                        { backgroundColor: "rgba(46,204,113,0.1)" },
                      ]}
                    >
                      {/* <Ionicons name="leaf-outline" size={16} color="#2ecc71" /> */}
                      <Image source={require('@/assets/images/nutritional/watermelon.png')} style={{width: 14, height: 14}}/>
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(
                          productInfo.nutriments?.["carbohydrates_100g"],
                          Number(quantityGrams)
                        ) + " g"}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.calories, { color: colors.blackFix }]}>
                    {formatNutrientValue(
                      productInfo.nutriments?.["energy-kcal_100g"],
                      Number(quantityGrams)
                    )}{" "}
                    kcal
                  </Text>
                </View>
              </View>
            )}
            <View style={[styles.badge, isHealthy() ? styles.healthy : styles.warning]}>
              <MaterialIcons
                name={isHealthy() ? "check-circle" : "warning"}
                size={16}
                color="white"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.text}>
                {isHealthy() ? "Healthy" : "À consommer avec modération"}
              </Text>
            </View>

            {getGenericName(productInfo, i18n.language) !== '' && (
              <Text style={styles.productDesc}>
                {String(getGenericName(productInfo, i18n.language))}
              </Text>
            )}
    <View style={styles.nutritionContainer}>
      <Text style={styles.nutritionTitle}>
        Valeurs nutritionnelles pour ({quantityGrams} {productInfo?.product_quantity_unit || "g"})
      </Text>

      {[
        { key: "energy-kcal_100g", label: "Calories", unit: "kcal", maxValue: basalMetabolicRate, color: colors.blue, reduxKey: "calories" },
        { key: "proteins_100g", label: "Protéines", unit: "g", maxValue: proteinsGoal, color: colors.blue, reduxKey: "proteins" },
        { key: "fat_100g", label: "Lipides", unit: "g", maxValue: fatsGoal, color: colors.blue, reduxKey: "fats" },
        { key: "carbohydrates_100g", label: "Glucides", unit: "g", maxValue: carbsGoal, color: colors.blue, reduxKey: "carbs" },
        { key: "sugars_100g", label: "Sucres", unit: "g" },
        { key: "saturated-fat_100g", label: "Graisses saturées", unit: "g" },
        { key: "fiber_100g", label: "Fibres", unit: "g" },
        { key: "salt_100g", label: "Sel", unit: "g" },
        { key: "sodium_100g", label: "Sodium", unit: "mg" },
      ].map((nutrient) => {
        if (!productInfo.nutriments?.[nutrient.key]) return null;

        const productValue = Number(formatNutrientValue(productInfo.nutriments[nutrient.key], Number(quantityGrams)));
        const reduxValue = nutrient.reduxKey ? Number(userRedux?.goalLogs?.[nutrient.reduxKey] || 0) : 0;
        const totalMax = Number(nutrient.maxValue) + reduxValue;
        const totalValue = productValue + reduxValue;

        const percentageValue = productValue;
        const maxForBar = nutrient.maxValue; 

        return (
          <View style={styles.nutritionRow} key={nutrient.key}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.nutritionLabel, { color: colors.black }]}>{nutrient.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.nutritionValue}>
                {nutrient.maxValue
                  ? `${productValue} / ${totalMax} ${nutrient.unit}`
                  : `${productValue} ${nutrient.unit}`}
              </Text>
              {reduxValue > 0 && (
                <Image
                  source={require('@/assets/images/icon/goal.png')}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
              )}
              </View>
            </View>

            {nutrient.maxValue && (
              <View style={{ marginTop: 8 }}>
                <ProgressBarFluid
                  value={percentageValue}
                  maxValue={totalMax}
                  nutri={nutrient.unit}
                  colorBarProgresse={nutrient.color || "#4CAF50"}
                  backgroundBarprogress="rgba(237, 237, 237, 1)"
                  height={18}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
          </>
        )}
      </ScrollView>
        {productInfo && !productInfo.error && (
          <BottomInputBarQr
            quantityGrams={quantityGrams}
            handleCreateAliment={createAliment}
            selectedMealType={"breakfast"}
            setSelectedMealType={setSelectedMealType}
            setQuantityGrams={setQuantityGrams}
            loading={loadingCreateAliment}
            isPremium={true}
          />
        )}
        {showNotification && (
          <View style={[styles.notificationContainer, { backgroundColor: colors.grayMode}]}>
            <Image source={{ uri: productInfo?.image_url }} resizeMode="contain" style={{width: 45, height: 45}}/>
            <View>
              <Text style={[styles.notificationTitle, { color: colors.black}]}>{productInfo?.product_name}</Text>
              <Text style={[styles.notificationText, { color: colors.black}]}>{notifMessage}</Text>
            </View>
            {liked ? (
            <LottieView
              source={require('@/assets/lottie/Black Check.json')}
              loop={false}
              style={{ width: 40, height: 40 }}
              autoPlay
            />
            ) : (
            <LottieView
              source={require('@/assets/lottie/Deleted.json')}
              loop={false}
              style={{ width: 40, height: 40 }}
              autoPlay
            />
            )}
          </View>
        )}

    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  card: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: "center", width: "100%", alignSelf: "center", backgroundColor: "white" },
  productDesc: { fontSize: 16, color: "black", textAlign: "center", marginBottom: 12 },
  nutritionContainer: { width: "100%", marginTop: 10, borderTopWidth: 1,marginBottom: 20, borderTopColor: "#eee", paddingTop: 10, gap: 10 },
  nutritionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  nutritionRow: { flexDirection: "column", paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#eee", borderRadius: 8, gap: 10 },
  nutritionLabel: { fontSize: 16, fontWeight: "500" },
  nutritionValue: { fontSize: 16, fontWeight: "500" },
  errorText: { color: "red", fontSize: 16, fontWeight: "bold" },
  containerImage: { flexDirection: "row", borderRadius: 10, padding: 10, marginVertical: 5, alignItems: "center" },
  image: { width: 110, height: 110, borderRadius: 10 },
  details: { flex: 1, marginLeft: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
  nutrients: { flexDirection: "row", marginVertical: 5, gap: 4, flexWrap: "wrap", overflow: "hidden" },
  nutrientItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: "hidden" },
  nutrientText: { color: "black", marginLeft: 5 },
  calories: { fontSize: 20, fontWeight: "bold" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#eee" },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginVertical: 10,
  },
  healthy: {
    backgroundColor: '#4CAF50',
  },
  warning: {
    backgroundColor: '#FF9800',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  icon: {
    width: 25,
    height: 25
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  retryButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  notificationContainer: {
    position: "absolute",
    flexDirection: "row",
    height: 90,
    bottom: 120,
    borderRadius: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 999,
    width: "90%",
    marginLeft: "5%",
    padding: 10,
    overflow: "hidden",
  },
  notificationTitle :  {
    fontSize: 16,
    fontWeight: "500",
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 5
  },
});
