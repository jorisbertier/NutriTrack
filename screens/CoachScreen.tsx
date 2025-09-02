import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const adviceList = [
  "Sois toi-même, c'est ta meilleure arme !",
  "N'hésite pas à briser la glace avec un compliment sincère.",
  "Prends ton temps, ne te précipite pas.",
  "Un sourire vaut mille mots 😄",
];

const CoachScreen = () => {
  const [adviceIndex, setAdviceIndex] = useState(0);

  const nextAdvice = () => {
    setAdviceIndex((prev) => (prev + 1) % adviceList.length);
  };

  return (
    <View style={styles.container}>
      {/* Bulle de conversation */}
      <View style={styles.adviceContainer}>
        <Text style={styles.adviceText}>{adviceList[adviceIndex]}</Text>
        <View style={styles.triangle} />
      </View>

      {/* Animation en bas */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require("@/assets/lottie/Fox.json")}
          loop
          autoPlay
          style={{ width: 220, height: 220 }}
        />
      </View>

      {/* Bouton en dessous */}
      <TouchableOpacity style={styles.button} onPress={nextAdvice}>
        <Text style={styles.buttonText}>Prochain conseil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E1",
    alignItems: "center",
    justifyContent: "flex-end", // pousse tout vers le bas
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  adviceContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    maxWidth: width * 0.8,
    position: "absolute",
    top: 80, // position en haut
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  triangle: {
    position: "absolute",
    bottom: -12,
    left: "50%",
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFF", // couleur bulle
  },
  adviceText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  animationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF7F50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CoachScreen;
