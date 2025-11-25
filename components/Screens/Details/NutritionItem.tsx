import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState } from "react";

type Props = {
    name: string,
    quantity: number,
    unit: string,
    isPremium?: boolean,
    keyName?: string, 
}


export default function NutritionItem({keyName, name, quantity, unit, isPremium}: Props) {

    const {colors} = useTheme();

    const nonPremiumKeys = ["proteins", "carbohydrates", "fats"];
    const showValue = !nonPremiumKeys.includes(keyName ?? "") ? isPremium : true;

    const formattedQuantity = Number.isInteger(quantity)
        ? quantity
        : quantity.toFixed(1);

    return (
        <View style={styles.nutri}>
            <ThemedText color={colors.black} variant="title1">{name}</ThemedText>
            {showValue ? (
                <Text style={{height: 20, color: colors.black, fontSize: 16, fontWeight: "500"}}>
                    {formattedQuantity} {unit}
                </Text>
            ) : (
                <Image
                    source={require('@/assets/images/icon/crown.png')}
                    style={{width: 20, height: 20, tintColor: "#FFD700"}}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    nutri : {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12
    }
})