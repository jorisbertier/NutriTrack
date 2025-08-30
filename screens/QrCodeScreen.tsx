import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import ProgressBarFluid from "@/components/ProgressBarFluid";
import BottomInputBarQr from "@/components/Scan/QrBottomBar";
import { useTheme } from "@/hooks/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  BasalMetabolicRate,
  calculAge,
  calculCarbohydrates,
  calculFats,
  calculProteins,
  fetchUserDataConnected,
} from "@/functions/function";
import { User } from "@/interface/User";

export default function QrCodeScreen({ route }) {
  const barcode = route?.params?.barcode;

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
  const [quantityGrams, setQuantityGrams] = useState("100"); // valeur initiale 100g
  const { colors } = useTheme();

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
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
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

  // Fonction pour adapter la valeur à la quantité et arrondir à 1 chiffre après la virgule
  const formatNutrientValue = (
    nutrientValue: number | string | undefined,
    grams: number
  ) => {
    if (!nutrientValue) return 0;
    const valueNum = Number(nutrientValue);
    const adjusted = (valueNum * grams) / 100;
    return Math.round(adjusted * 10) / 10;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {!productInfo ? (
          <Text>Chargement…</Text>
        ) : productInfo.error ? (
          <Text style={styles.errorText}>{productInfo.error}</Text>
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
                      <Ionicons name="fast-food-outline" size={16} color="#00aaff" />
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(
                          productInfo.nutriments?.["proteins_100g"],
                          Number(quantityGrams)
                        )}{" "}
                        g
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.nutrientItem,
                        { backgroundColor: "rgba(244,162,97,0.1)" },
                      ]}
                    >
                      <Ionicons name="egg-outline" size={16} color="#f4a261" />
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(
                          productInfo.nutriments?.["fat_100g"],
                          Number(quantityGrams)
                        )}{" "}
                        g
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.nutrientItem,
                        { backgroundColor: "rgba(46,204,113,0.1)" },
                      ]}
                    >
                      <Ionicons name="leaf-outline" size={16} color="#2ecc71" />
                      <Text style={styles.nutrientText}>
                        {formatNutrientValue(
                          productInfo.nutriments?.["carbohydrates_100g"],
                          Number(quantityGrams)
                        )}{" "}
                        g
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

            <Text>{isHealthy() ? "Healthy ✅" : "À consommer avec modération ⚠️"}</Text>

            {productInfo.generic_name && (
              <Text style={styles.productDesc}>{productInfo.generic_name}</Text>
            )}

            <View style={styles.nutritionContainer}>
              <Text style={styles.nutritionTitle}>
                Valeurs nutritionnelles (pour {quantityGrams}g)
              </Text>

              {[
                {
                  key: "energy-kcal_100g",
                  label: "Calories",
                  unit: "kcal",
                  maxValue: basalMetabolicRate,
                  color: colors.gray,
                },
                {
                  key: "proteins_100g",
                  label: "Protéines",
                  unit: "g",
                  maxValue: proteinsGoal,
                  color: colors.greenLight,
                },
                { key: "fat_100g", label: "Lipides", unit: "g", maxValue: carbsGoal, color: colors.blue },
                {
                  key: "carbohydrates_100g",
                  label: "Glucides",
                  unit: "g",
                  maxValue: fatsGoal,
                  color: colors.blueLight,
                },
                { key: "sugars_100g", label: "Sucres", unit: "g" },
                { key: "saturated-fat_100g", label: "Graisses saturées", unit: "g" },
                { key: "fiber_100g", label: "Fibres", unit: "g" },
                { key: "salt_100g", label: "Sel", unit: "g" },
                { key: "sodium_100g", label: "Sodium", unit: "mg" },
              ].map(
                (nutrient) =>
                  productInfo.nutriments?.[nutrient.key] && (
                    <View
                      style={[styles.nutritionRow, { backgroundColor: colors.gray }]}
                      key={nutrient.key}
                    >
                      <View
                        style={{ flexDirection: "row", justifyContent: "space-between" }}
                      >
                        <Text style={[styles.nutritionLabel, { color: colors.black }]}>
                          {nutrient.label}
                        </Text>
                        <Text style={styles.nutritionValue}>
                          {nutrient.maxValue
                            ? `${formatNutrientValue(
                                productInfo.nutriments[nutrient.key],
                                Number(quantityGrams)
                              )} / ${nutrient.maxValue} ${nutrient.unit}`
                            : `${formatNutrientValue(
                                productInfo.nutriments[nutrient.key],
                                Number(quantityGrams)
                              )} ${nutrient.unit}`}
                        </Text>
                      </View>

                      {nutrient.maxValue && (
                        <View style={{ marginTop: 8 }}>
                          <ProgressBarFluid
                            value={formatNutrientValue(
                              productInfo.nutriments[nutrient.key],
                              Number(quantityGrams)
                            )}
                            maxValue={Number(nutrient.maxValue)}
                            nutri={nutrient.unit}
                            colorBarProgresse={nutrient.color || "#4CAF50"}
                            backgroundBarprogress="rgba(220, 220, 220, 1)"
                            height={18}
                          />
                        </View>
                      )}
                    </View>
                  )
              )}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <BottomInputBarQr
          quantityGrams={quantityGrams}
          setQuantityGrams={setQuantityGrams}
          isPremium={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: "center", width: "100%", alignSelf: "center", backgroundColor: "white" },
  productDesc: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 12 },
  nutritionContainer: { width: "100%", marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10, gap: 10 },
  nutritionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  nutritionRow: { flexDirection: "column", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 10 },
  nutritionLabel: { fontSize: 16, fontWeight: "500" },
  nutritionValue: { fontSize: 16, fontWeight: "400" },
  errorText: { color: "red", fontSize: 16, fontWeight: "bold" },
  containerImage: { flexDirection: "row", borderRadius: 10, padding: 10, marginVertical: 5, alignItems: "center" },
  image: { width: 110, height: 110, borderRadius: 10 },
  details: { flex: 1, marginLeft: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
  nutrients: { flexDirection: "row", marginVertical: 5, gap: 4 },
  nutrientItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: "hidden" },
  nutrientText: { color: "black", marginLeft: 5 },
  calories: { fontSize: 20, fontWeight: "bold" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#eee" },
});
