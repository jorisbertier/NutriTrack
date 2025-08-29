import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function BarcodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false); // false = caméra fermée
  const [productInfo, setProductInfo] = useState<any>(null);

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
console.log(productInfo)
  return (
    <View style={styles.container}>
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
          {productInfo.image_url && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: productInfo.image_url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Nom du produit */}
          <Text style={styles.productName}>{productInfo.product_name}</Text>
          {productInfo.generic_name && (
            <Text style={styles.productDesc}>{productInfo.generic_name}</Text>
          )}
          <View style={styles.nutritionContainer}>
  <Text style={styles.nutritionTitle}>Valeurs nutritionnelles (pour 100g)</Text>

  {[
    { key: "energy-kcal_100g", label: "Calories", unit: "kcal" },
    { key: "proteins_100g", label: "Protéines", unit: "g" },
    { key: "carbohydrates_100g", label: "Glucides", unit: "g" },
    { key: "sugars_100g", label: "Sucres", unit: "g" },
    { key: "fat_100g", label: "Lipides", unit: "g" },
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
      <View style={styles.nutritionRow} key={key}>
        <Text style={styles.nutritionLabel}>{label}</Text>
        <Text style={styles.nutritionValue}>
          {productInfo.nutriments[key]} {unit}
        </Text>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    width: "90%",
    alignSelf: "center",
  },
  imageWrapper: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#444",
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: "500",
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
});
