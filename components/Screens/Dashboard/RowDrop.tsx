import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RowDrop({ meal, totalCaloriesByMeal,isOpen, onPress }: { meal: string, totalCaloriesByMeal: number,isOpen: any, onPress: any }) {

            // Crée une référence à Animated.Value
            const rotateAnimation = useRef(new Animated.Value(0)).current;

            // Utilise l'effet pour gérer l'animation lorsque l'état d'ouverture change
            useEffect(() => {
                Animated.timing(rotateAnimation, {
                    toValue: isOpen ? 1 : 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            }, [isOpen]);
        
            // Interpoler la valeur pour transformer la rotation
            const rotateInterpolate = rotateAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg'], // Alterner entre 0 et 180 degrés
            });
        
            const animatedStyle = {
                transform: [{ rotate: rotateInterpolate }],
            };
    return (
        <Row style={styles.row}>
        <ThemedText variant="title">{meal}</ThemedText>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20}}>
            <ThemedText>{totalCaloriesByMeal} Kcal</ThemedText>
            <TouchableOpacity onPress={onPress}>
                <Animated.Image source={require('@/assets/images/chevron-haut.png')} style={[{width: 20, height: 20}, animatedStyle]}/>
            </TouchableOpacity>
        </View>
    </Row>
    )
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    }
})
