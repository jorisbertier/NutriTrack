import ProgressBarFluid from "@/components/ProgressBarFluid";
import { ProgressBarKcal } from "@/components/ProgressBarKcal";
import { useTheme } from "@/hooks/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function BarcodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false); // false = caméra fermée
  const [productInfo, setProductInfo] = useState<any>(null);

  const { colors } = useTheme();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <Button onPress={requestPermission} title="Autoriser la caméra" />
      </View>
    );
  }

  // Fonction déclenchée quand un code-barres est scanné
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanning(false); // Fermer la caméra après scan

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const json = await response.json();

      if (json.status === 1) {
        setProductInfo(json.product);
      } else {
        setProductInfo({ error: "Produit non trouvé" });
      }
    } catch (error) {
      setProductInfo({ error: "Erreur API" });
    }
  };

  const isHealthy = () => {
  const sugar = productInfo.nutriments?.["sugars_100g"] || 0;
  const fat = productInfo.nutriments?.["fat_100g"] || 0;
  const saturated = productInfo.nutriments?.["saturated-fat_100g"] || 0;

  // Exemple simple : moins de 5g de sucre et moins de 5g de graisses saturées => healthy
  return sugar <= 5 && fat <= 10 && saturated <= 5;
};
  return (
    <View style={[styles.container, { backgroundColor: colors.white }
    ]}>
      {!scanning ? (
        <>
          <Button title="Scanner un produit" onPress={() => setScanning(true)} />

           {productInfo && (
    <View style={styles.card}>
      {productInfo.error ? (
        <Text style={styles.errorText}>{productInfo.error}</Text>
      ) : (
        <>
          {/* Image du produit */}
          {/* <View style={{width: "100%", flexDirection: 'row', backgroundColor: colors.gray, borderRadius: 20, padding: 10, alignItems: 'center'}}>
          
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: productInfo.image_url }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          
            <View style={{marginLeft: 12, flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: 500}}>{productInfo.product_name}</Text>
              <Text style={{fontSize: 20, fontWeight: 600}}>{productInfo.nutriments?.["energy-kcal_100g"] || 0} kcal</Text>
            </View>
          </View> */}
          {productInfo.image_url && (
<View style={[styles.containerImage, {backgroundColor: colors.gray}]}>
      <Image
        source={{ uri: productInfo.image_url }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.details}>
        <Text style={[styles.title, {color: colors.blackFix}]}>{productInfo.product_name}</Text>
        <View style={styles.nutrients}>
          <View style={[styles.nutrientItem, { backgroundColor: "rgba(0, 170, 255, 0.1)"}]}>
            <Ionicons name="fast-food-outline" size={16} color="#00aaff" />
            <Text style={styles.nutrientText}>{productInfo.nutriments?.["proteins_100g"] || 0} g</Text>
          </View>
          <View style={[styles.nutrientItem, { backgroundColor: "rgba(244, 162, 97, 0.1)"}]}>
            <Ionicons name="egg-outline" size={16} color="#f4a261" />
            <Text style={styles.nutrientText}>{productInfo.nutriments?.["fat_100g"] || 0} g</Text>
          </View>
          <View style={[styles.nutrientItem, { backgroundColor: "rgba(46, 204, 113, 0.1)"}]}>
            <Ionicons name="leaf-outline" size={16} color="#2ecc71" />
            <Text style={styles.nutrientText}>{productInfo.nutriments?.["carbohydrates_100g"] || 0} g</Text>
          </View>
        </View>
        <Text style={[styles.calories, { color: colors.blackFix}]}>{productInfo.nutriments?.["energy-kcal_100g"] || 0} kcal</Text>
      </View>
    </View>
          )}


          {/* Nom du produit */}
                <Text>
        {isHealthy() ? "Healthy ✅" : "À consommer avec modération ⚠️"}
      </Text>
          {productInfo.generic_name && (
            <Text style={styles.productDesc}>{productInfo.generic_name}</Text>
          )}
          <View style={styles.nutritionContainer}>
  <Text style={styles.nutritionTitle}>Valeurs nutritionnelles (pour 100g)</Text>

  {[
    { key: "sugars_100g", label: "Sucres", unit: "g" },
    { key: "saturated-fat_100g", label: "Graisses saturées", unit: "g" },
    { key: "fiber_100g", label: "Fibres", unit: "g" },
    { key: "salt_100g", label: "Sel", unit: "g" },
    { key: "sodium_100g", label: "Sodium", unit: "mg" },
    { key: "vitamin-a_100g", label: "Vitamine A", unit: "µg" },
    { key: "vitamin-c_100g", label: "Vitamine C", unit: "mg" },
    { key: "vitamin-d_100g", label: "Vitamine D", unit: "µg" },
    { key: "vitamin-e_100g", label: "Vitamine E", unit: "mg" },
    { key: "vitamin-k_100g", label: "Vitamine K", unit: "µg" },
    { key: "vitamin-b1_100g", label: "Vitamine B1", unit: "mg" },
    { key: "vitamin-b2_100g", label: "Vitamine B2", unit: "mg" },
    { key: "vitamin-b6_100g", label: "Vitamine B6", unit: "mg" },
    { key: "vitamin-b12_100g", label: "Vitamine B12", unit: "µg" },
    { key: "calcium_100g", label: "Calcium", unit: "mg" },
    { key: "iron_100g", label: "Fer", unit: "mg" },
    { key: "magnesium_100g", label: "Magnésium", unit: "mg" },
    { key: "zinc_100g", label: "Zinc", unit: "mg" },
    { key: "potassium_100g", label: "Potassium", unit: "mg" },
  ].map(({ key, label, unit }) =>
    productInfo.nutriments?.[key] ? (
      <View style={[styles.nutritionRow, { backgroundColor: colors.gray}]} key={key}>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.nutritionLabel, { color : colors.black}]}>{label}</Text>
          <Text style={[styles.nutritionValue]}>
            {productInfo.nutriments[key]} {unit}
          </Text>

        </View>
        <View style={{flexDirection: "row", alignItems: "center", gap: 6}}>
          {/* <View style={{width: "20%"}}>
          <Text>55 %</Text>

          </View> */}
          <View style={{width: "80%"}}>
          <ProgressBarFluid
  value={45}
  maxValue={100}
  nutri="kcal"
  colorBarProgresse="#FF7043"
  backgroundBarprogress="#F2F2F2"
  height={18}
/>
            </View>
        </View>
      </View>
    ) : null
  )}
</View>

        </>
      )}
    </View>
  )}
        </>
      ) : (
        // Caméra en plein écran seulement quand on scanne
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white"
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: 80,
    height: 80, 
    borderRadius: 40,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  nutritionContainer: {
    width: "100%",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    gap: 10
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  nutritionRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, width: "100%" },
  message: { textAlign: "center", paddingBottom: 10 },
  infoContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
   containerImage: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutrients: {
    flexDirection: 'row',
    marginVertical: 5,
    gap: 4,
  },
  nutrientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  nutrientText: {
    color: "black",
    marginLeft: 5,
  },
  calories: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrow: {
    marginLeft: 10,
  },
});
