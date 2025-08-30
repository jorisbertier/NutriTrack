import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Reset scanned chaque fois que l'écran est actif
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Nous avons besoin de la permission caméra.</Text>
        <Button title="Autoriser" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = (event) => {
    const data = event?.data ?? event?.nativeEvent?.data;
    if (!data || scanned) return;

    setScanned(true);
    navigation.navigate("qrcode", { barcode: data });
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned} // ✅ Correct
        />
      )}

      <View style={styles.topButtons}>
        <Button title="Annuler" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1 },
  topButtons: {
    position: "absolute",
    top: 40,
    left: 10,
  },
});
