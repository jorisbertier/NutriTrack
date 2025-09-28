import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BetaBadge = () => {
    return (
        <TouchableOpacity style={styles.container}>
        <LinearGradient
            colors={["#f583ff", "#9671ff", "#77c6ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            <Text style={styles.text}>BETA</Text>
        </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 40,
        right: 20,
        borderRadius: 15,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    gradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    text: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
    },
});

export default BetaBadge;
