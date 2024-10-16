import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { Link } from "expo-router";
import { useNavigation } from "expo-router";

type Props = {
    id: number,
    name: string,
    calories: string,
    unit: string,
    quantity: number
}

export default function CardFood({name, id, calories, unit, quantity}: Props) {
    const navigation = useNavigation<any>();

    const navigateToDetails = () => {
        navigation.navigate('FoodDetails', { id });
    };


    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={styles.cardFood}>
                <View style={styles.text}>
                    <ThemedText variant="title1">{capitalizeFirstLetter(`${name}`)}</ThemedText>
                    <ThemedText variant="title2" color={'grayDark'}>{calories} cal, {name} {quantity} {unit}</ThemedText>
                </View>
                <View>
                    <Image source={require('@/assets/images/add.png')} style={styles.add}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardFood: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        height: 80,
        borderRadius: 15,
        width: '100%'
    },
    add : {
        width: 35,
        height: 35
    },
    text: {
        gap: 5
    }
})