import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/ThemeProvider";

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

        return (
        <View style={styles.nutri}>
            <ThemedText color={colors.black} variant="title1">{name}</ThemedText>
            <Text style={{height: 20, color: colors.black, fontSize: 15}} >{formattedQuantity} {unit}</Text>
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