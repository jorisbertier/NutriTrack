import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/ThemeProvider";
import { useState } from "react";

type Props = {
    name: string,
    quantity: number,
    unit: string
}

export default function NutritionItem({name, quantity, unit}: Props) {

    const {colors} = useTheme();
    const formattedQuantity = Number.isInteger(quantity)
    ? quantity
    : quantity.toFixed(1);
    const [isPremium, steIsPremium] = useState(false)

        return (
        <View style={styles.nutri}>
            <ThemedText color={colors.black} variant="title1">{name}</ThemedText>
            <Text style={{height: 20, color: colors.black, fontSize: 15}} >{formattedQuantity} {unit}</Text>
            {/* <Image source={require('@/assets/images/icon/crown.png')} style={{width: 20, height: 20, tintColor: "#FFD700"}} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    nutri : {
        borderBottomWidth: 1,
        borderBlockColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
    }
})