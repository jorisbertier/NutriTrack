import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useNavigation } from "expo-router";

type Props = {
    id: number,
    name: string,
    calories: string,
    unit: string,
    quantity: number,
    image: string
}

export default function CardFoodResume({name, id, calories, unit, quantity, image}: Props) {

    return (
            <View style={styles.cardFood}>
                <View style={styles.wrapperText}>
                    <Image source={{uri: `${image}`}} style={styles.image}/>
                    <View style={styles.text}>
                        <ThemedText variant="title1">{capitalizeFirstLetter(`${name}`)}</ThemedText>
                        <ThemedText variant="title2" color={'grayDark'}>{calories} Kcal,{quantity} {unit}</ThemedText>
                    </View>
                </View>
                <View>
                    <Image source={require('@/assets/images/add.png')} style={styles.add}/>
                </View>
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
    add : {
        width: 35,
        height: 35
    },
    text: {
        gap: 5
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
})