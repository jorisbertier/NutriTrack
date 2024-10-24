
import { ThemedText } from "./ThemedText";
import Row from "./Row";
import { FoodItem } from '../interface/FoodItem';
import { FlatList, Image, StyleSheet, View } from "react-native";
import CardFoodResume from "./Screens/Dashboard/CardFoodResume";
import RowDrop from "./Screens/Dashboard/RowDrop";
import { useState } from "react";

export function DisplayResultFoodByMeal(resultMeal: any, meal: string,handleDeleteFood: (userMealId: string) => void) {
    
    const totalCaloriesByMeal = resultMeal.reduce((accumulator, item) => {
        return accumulator + item.calories;
    }, 0);

    return (
        <View style={styles.wrapper}>
            <Row style={styles.row}>
                <ThemedText variant="title">{meal}</ThemedText>
                    <ThemedText>{totalCaloriesByMeal} Kcal</ThemedText>
            </Row>
            <Row>
            { resultMeal.length !== 0 ? (
                <FlatList<FoodItem>
                    data={resultMeal}
                    renderItem={({ item }) => (
                        // <ThemedText>{item.name}</ThemedText>
                        <CardFoodResume
                        name={item.name}
                        quantity={item.quantity}
                        unit={item.unit}
                        image={item.image}
                        id={item.id}
                        userMealId={item.userMealId}
                        calories={item.calories}
                        handleDelete={()=> handleDeleteFood(item.userMealId)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.userMealId ? item.userMealId : item.id.toString()}
                />
                ) : (
                    <ThemedText>Don't have any food for {meal}</ThemedText>
            )}
            </Row>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 10,
    },
    wrapperFood : {
        marginBottom: 16,
    },
    row: {
        width: '100%',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    }
})