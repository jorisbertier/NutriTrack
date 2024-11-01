import { StyleSheet } from "react-native";
import { View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Dimensions } from "react-native";
import { capitalizeFirstLetter } from "@/functions/function";
import useThemeColors from "@/hooks/useThemeColor";

type Props = {
    nutri: string;
    quantity: number | undefined;
    unit: string;
    height: number
}

const { height } = Dimensions.get('window');

export default function NutritionStatCard({nutri, height, quantity, unit}: Props) {
    const colors = useThemeColors();

    return (
        <View>
            <View style={styles.statFirst}>
                <Image source={require('@/assets/images/nutritional/burn.png')} style={styles.iconNutri} />
            <View style={[styles.statContainer, { backgroundColor: colors.primary, height: height}]}>
                <ThemedText variant="title2" color={'white'} style={styles.statTitle}>{capitalizeFirstLetter(nutri)}</ThemedText>
                <ThemedText variant="title1" color={'white'} style={styles.statValue}>{quantity} {unit}</ThemedText>
            </View>
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
        height: 140,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginBottom: 20
    },
    iconNutri: {
        width: 25,
        height:25,
        position:'absolute',
        top: 10
    },
    statContainer: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: height * 0.13,
        bottom: -25,
    },
    statTitle: {
        marginBottom: 5,
    },
    statValue: {
        marginBottom: 10,
    },
})