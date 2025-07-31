import { ImageSourcePropType, StyleSheet, View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useTheme } from "@/hooks/ThemeProvider";

type Props = {
    nutri: string;
    quantity?: number;
    unit: string;
    height: number;
    source: ImageSourcePropType;
};

export default function NutritionStatCard({
    nutri,
    quantity,
    unit,
    height,
    source,
}: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.cardContainer, { backgroundColor: colors.whiteFix }]}>
        <Image source={source} style={[styles.icon, { tintColor: colors.blackFix}]} resizeMode="contain" />

        <View style={[styles.innerBox, { height, backgroundColor: colors.blueLight }]}>
            <ThemedText variant="title3" style={[styles.label, { color: colors.blackFix }]}>
            {capitalizeFirstLetter(nutri)}
            </ThemedText>
            <ThemedText variant="title2" style={[styles.value, { color: colors.blackFix }]}>
            {quantity} {unit}
            </ThemedText>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 110,
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 20,
    },
    icon: {
        width: 23,
        height: 23,
        marginBottom: 10,
        opacity: 0.8
    },
    innerBox: {
        borderRadius: 15,
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontWeight: "600",
        marginBottom: 5,
        textAlign: "center",
        fontSize: 12
    },
    value: {
        fontWeight: "bold",
        textAlign: "center",
    },
});
