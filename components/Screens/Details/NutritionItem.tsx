import { StyleSheet } from "react-native";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

type Props = {
    name: string,
    quantity: string
}

export default function NutritionItem({name, quantity}: Props) {
    return (
        <View style={styles.nutri}>
            <ThemedText variant="title1">{name}</ThemedText>
            <ThemedText variant="title1">{quantity}</ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    nutri : {
        borderBottomWidth: 1,
        borderBlockColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14
    }
})