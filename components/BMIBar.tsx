import { calculateBMI } from "@/functions/function";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type BMIBarProps = {
    weight: number;
    height: number;
};

export default function BMIBar({ weight, height }: BMIBarProps) {
    const bmi = calculateBMI(weight, height);
    
    const categories = [
        { label: "Underweight", min: 0, max: 18.5, color: "#4DA6FF" },
        { label: "Healthy", min: 18.5, max: 25, color: "#4CAF50" },
        { label: "Overweight", min: 25, max: 30, color: "#FFC107" },
        { label: "Obese", min: 30, max: 40, color: "#F44336" },
    ];

    const currentCategory = categories.find((cat) => bmi >= cat.min && bmi < cat.max) || categories[3];
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [barWidth, setBarWidth] = useState(0);
    const normalizedBMI = Math.min(bmi, 40);

    useEffect(() => {
        if (barWidth > 0 && bmi > 0) {
        const position = (normalizedBMI / 40) * (barWidth - 6);
        console.log("Bar width:", barWidth, "Starting animation with position:", position);
        Animated.spring(animatedValue, {
            toValue: position,
            useNativeDriver: true,
            speed: 2,
            bounciness: 12,
        }).start();
        }
    }, [bmi, barWidth]);

    const handleBarLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        setBarWidth(width);
    };

    if (!bmi) {
        return (
        <View style={styles.container}>
            <Text>Veuillez fournir un poids et une hauteur valides.</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", gap: 25, alignItems: "center" }}>
                    <Text style={styles.bmiValue}>
                        {bmi}
                    </Text>
                    <View
                        style={[
                        styles.badge,
                        { backgroundColor: currentCategory.color + "20" },
                        ]}
                    >
                        <Text
                        style={[
                            styles.badgeText,
                            { color: currentCategory.color, fontWeight: "700" },
                        ]}
                        >
                        {currentCategory.label.toUpperCase()}
                        </Text>
                    </View>
                </View>
                {/* <Text style={styles.subtitle}>Your current BMI Mass Index</Text> */}
                <Text style={styles.subtitle}>BMI indicates your weight relative to your height.</Text>
                {/* <Text style={styles.helperText}>
                    BMI indicates your weight relative to your height.
                </Text> */}
            </View>

            <View style={styles.gradientWrapper}>
                <View style={styles.gradientContainer} onLayout={handleBarLayout}>
                <LinearGradient
                    colors={["#4DA6FF", "#4CAF50", "#FFC107", "#F44336"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBar}
                />
                </View>
                <Animated.View
                style={[
                    styles.indicator,
                    {
                    transform: [{ translateX: animatedValue }],
                    backgroundColor: "black",
                    },
                ]}
                onLayout={() => console.log("Indicator rendered")}
                />
            </View>

            <View style={styles.legend}>
                {categories.map((cat) => (
                <View key={cat.label} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                    <Text style={styles.legendText}>{cat.label}</Text>
                </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 14,
        color: "#888",
        fontWeight: "500",
        marginBottom: 4,
        textAlign: "center",
        marginTop: 2
    }, 
    bmiValue: {
        fontSize: 34,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
    },
    unit: {
        fontSize: 18,
        fontWeight: "500",
        color: "#555",
    },
    helperText: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginTop: 6,
        lineHeight: 16,
    },
    badge: {
        alignSelf: "center",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 12,
    },
    gradientWrapper: {
        position: "relative",
        marginTop: 8,
        marginBottom: 10,
        overflow: "visible",
    },
    gradientContainer: {
        height: 16,
        borderRadius: 10,
        backgroundColor: "#eee",
        width: "100%",
    },
    gradientBar: {
        flex: 1,
        borderRadius: 10,
    },
    indicator: {
        position: "absolute",
        top: -4,
        width: 4,
        height: 24,
        borderRadius: 3,
        backgroundColor: "black",
        zIndex: 100,
    },
    legend: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        color: "#666",
    },
});