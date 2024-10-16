import { StyleSheet } from "react-native";
import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Dimensions } from "react-native";
import { capitalizeFirstLetter } from "@/functions/function";

type Props = {
    nutri: string;
    quantity: number | undefined;
    unit: string;
    backgroundcolor?: string
}

const { height } = Dimensions.get('window');

export default function NutritionStatCard({nutri, quantity, unit, backgroundcolor = '#000000'}: Props) {
    return (
        <View>
            <View style={styles.statFirst}>
                <Image source={require('@/assets/images/nutritional/burn.png')} style={styles.iconNutri} />
            </View>
            <View style={[styles.statContainer, { backgroundColor: backgroundcolor }]}>
                <ThemedText variant="title2" color={'white'} style={styles.statTitle}>{capitalizeFirstLetter(nutri)}</ThemedText>
                <ThemedText variant="title1" color={'white'} style={styles.statValue}>{quantity} {unit}</ThemedText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    statFirst :{
        padding: 20,
        backgroundColor: '#DFDFE0',
        position: 'relative',
        alignItems: 'center',
        width: height * 0.13,
        height: 75,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    iconNutri: {
        width: 25,
        height:25,
        position:'absolute',
        top: 10
    },
    statContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        height: height * 0.15,
        width: height * 0.13,
        top: -20,
    },
    statTitle: {
        marginBottom: 5,
    },
    statValue: {
        marginBottom: 10,
    },
})