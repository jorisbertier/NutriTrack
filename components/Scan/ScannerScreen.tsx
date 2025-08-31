import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useIsFocused, useFocusEffect, useRoute } from "@react-navigation/native";
import { useTheme } from "@/hooks/ThemeProvider";
import LottieView from "lottie-react-native";
import Svg, { Path } from "react-native-svg";
import { loadOptions } from "@babel/core";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { date } = route.params;

  const { colors } = useTheme(); 

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
    // @ts-ignore
    navigation.navigate("qrcode", { barcode: data, date: date });
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}

      <Pressable onPress={() => navigation.goBack()}  style={[styles.topButtons, { backgroundColor: colors.whiteFix}]} >
         <Svg viewBox="0 0 24 24" width={24} height={24} fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
            fill="#0F1729"
          />
        </Svg>
      </Pressable>
      <View style={[styles.scan, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
        <Text style={{color: colors.white, fontWeight: 500, fontSize: 16}}>Scanning</Text>

      </View>
      <View style={styles.loading}>
        <LottieView
            source={require('@/assets/lottie/Loading.json')}
            loop={true}
            style={{ width: 90, height: 90, borderRadius: 30 }}
            autoPlay={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1 },
  topButtons: {
    padding: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center", 
    top: 40,
    left: 10,
    borderRadius: "100%"
  },
  scan: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 120,
    height: 40,
    width: 120,
    alignSelf: "center",
    borderRadius: 8,
  },
  loading: {
    bottom: 150,
    position: "absolute",
    alignSelf: "center",
  }
});
