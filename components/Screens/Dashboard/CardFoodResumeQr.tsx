import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useTheme } from "@/hooks/ThemeProvider";

type Props = {
    // id: number,
    name: string,
    calories: number,
    unit: string,
    proteins: number,
    carbs: number,
    fats: number,
    quantity: number,
    quantityCustom: number,
    image: string,
    handleDelete: any
}

export default function CardFoodResumeQr({name, calories, unit, proteins,carbs, fats, quantityCustom, image, handleDelete}: Props) {

    const { theme, colors } = useTheme();
    const adjustedCalories = Math.round((calories * quantityCustom) / 100);
    const adjustedProteins = ((proteins * quantityCustom) / 100).toFixed(1);
    const adjustedCarbs = ((carbs * quantityCustom) / 100).toFixed(1);
    const adjustedFats = ((fats * quantityCustom) / 100).toFixed(1);
console.log(image)

    return (
            <View style={[styles.cardFood, {backgroundColor: colors.grayMode}]}>
                <View style={styles.wrapperText}>
                    <Image source={{uri: `${image}`}} style={styles.image}/>
                    <View style={styles.text}>
                        <ThemedText variant="title1" color={colors.black}>{capitalizeFirstLetter(`${name}`)}</ThemedText>
                        <ThemedText variant="title2" color={colors.grayDark}>{adjustedCalories} Kcal, {quantityCustom} {unit}</ThemedText>
                    </View>
                </View>
                {/* <View style={{flexDirection: 'row', gap: 2}}>
                    <View style={{width: 40, gap: 5}}>
                        <Text style={{fontWeight: 600, textAlign: 'center'}}>P</Text>
                        <Text style={{ color: colors.grayDark, fontWeight: 600, textAlign: 'center'}}>{adjustedProteins}</Text>
                    </View>
                    <View style={{width: 40, justifyContent: 'center', gap: 5}}>
                        <Text style={{fontWeight: 600, textAlign: 'center'}}>C</Text>
                        <Text style={{ color: colors.grayDark, fontWeight: 600, textAlign: 'center'}}>{adjustedCarbs}</Text>
                    </View>
                    <View style={{width: 40}}>
                        <Text style={{fontWeight: 600, textAlign: 'center', gap: 5}}>F</Text>
                        <Text style={{ color: colors.grayDark, fontWeight: 600, textAlign: 'center'}}>{adjustedFats}</Text>
                    </View>
                </View> */}
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
        marginVertical: 5,
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