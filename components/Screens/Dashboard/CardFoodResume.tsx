import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";

type Props = {
    id: number,
    name: string,
    calories: number,
    unit: string,
    quantity: number,
    image: string,
    userMealId: string | undefined,
    handleDelete: any
}

export default function CardFoodResume({name, id, calories, unit, quantity, image, userMealId, handleDelete}: Props) {

    return (
            <View style={styles.cardFood}>
                <View style={styles.wrapperText}>
                    <Image source={{uri: `${image}`}} style={styles.image}/>
                    <View style={styles.text}>
                        <ThemedText variant="title1">{capitalizeFirstLetter(`${name}`)}</ThemedText>
                        <ThemedText variant="title2" color={'grayDark'}>{calories} Kcal,{quantity} {unit}</ThemedText>
                    </View>
                </View>
                <TouchableOpacity  style={styles.test} onPress={handleDelete}>
                    <Image source={require('@/assets/images/delete.png')} style={styles.deleteImage}/>
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
        backgroundColor: '#F8F9FD',
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