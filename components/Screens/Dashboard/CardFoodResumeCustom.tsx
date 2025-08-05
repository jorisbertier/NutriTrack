import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useTheme } from "@/hooks/ThemeProvider";

type Props = {
    id: number,
    name: string,
    calories: number,
    unit: string,
    quantity: number,
    quantityCustom: number,
    image: string,
    userMealId: string | undefined,
    handleDelete: any
}

export default function CardFoodResumeCustom({name, calories, unit, quantityCustom, image, handleDelete}: Props) {

    const { theme, colors } = useTheme();
    const adjustedCalories = Math.round((calories * quantityCustom) / 100);


    return (
            <View style={[styles.cardFood, {backgroundColor: colors.grayMode}]}>
                <View style={styles.wrapperText}>
                    <Image source={{uri: `${image}`}} style={styles.image}/>
                    <View style={styles.text}>
                        <ThemedText variant="title1" color={colors.black}>{capitalizeFirstLetter(`${name}`)}</ThemedText>
                        <ThemedText variant="title2" color={colors.grayDark}>{adjustedCalories} Kcal, {quantityCustom} {unit}</ThemedText>
                    </View>
                </View>
                <TouchableOpacity  style={styles.test} onPress={handleDelete}>
                    {theme === "light" ?
                        <Image source={require('@/assets/images/delete.png')} style={styles.deleteImage}/>
                    :
                        <Image source={require('@/assets/images/deleteWhite.png')} style={styles.deleteImage}/>
                    }

                </TouchableOpacity>
            </View>
    )
}

const styles = StyleSheet.create({
    cardFood: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        borderRadius: 15,
        width: '100%',
        marginVertical: 5
    },
    wrapperText :{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    deleteImage : {
        width: 20,
        height: 20
    },
    text: {
        gap: 5
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    test : {
        padding: 10,
    }
})