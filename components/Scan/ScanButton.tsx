// ScanButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ScanButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Scanner")}
        >
        <Text style={styles.text}>Scanner un produit</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#00aaff",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
