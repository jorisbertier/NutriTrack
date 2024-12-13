
import { ThemedText } from "./ThemedText";
import Row from "./Row";
import { FoodItem } from '../interface/FoodItem';
import { FlatList, Image, StyleSheet, View } from "react-native";
import CardFoodResume from "./Screens/Dashboard/CardFoodResume";
import RowDrop from "./Screens/Dashboard/RowDrop";
import { useTheme } from "@/hooks/ThemeProvider";
import { FoodItemCreated } from '../interface/FoodItemCreated';
import CardFoodResumeCreated from "./Screens/Dashboard/CardFoodResumeCreated";

export function DisplayResultFoodByMeal(resultMeal: any, resultMealCreated: any, meal: string,handleDeleteFood: (userMealId: string) => void, handleDeleteFoodCreated: (userMealId: string) => void) {

    const {colors} = useTheme();
    
    const totalCaloriesByMeal = resultMeal.reduce((accumulator, item) => {
        return accumulator + item.calories;
    }, 0);

    const totalCaloriesByMealCreated = resultMealCreated.reduce((accumulator, item) => {
        return accumulator + item.calories;
    }, 0);

    console.log(resultMealCreated.length)
    console.log(resultMealCreated)
    return (
        <View style={styles.wrapper}>
            <Row style={styles.row}>
                <ThemedText variant="title" color={colors.black}>{meal}</ThemedText>
                    <ThemedText color={colors.black}>{totalCaloriesByMeal + totalCaloriesByMealCreated} Kcal</ThemedText>
            </Row>
            <Row>
            { resultMeal.length !== 0 && (
                <FlatList<FoodItem>
                    data={resultMeal}
                    renderItem={({ item }) => (
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
                )
                }
                </Row>
                <Row>
                    { resultMealCreated.length !== 0 && (
                        <FlatList<FoodItemCreated>
                            data={resultMealCreated}
                            renderItem={({ item }) => (
                                // <ThemedText>{item.name}</ThemedText>
                                <CardFoodResumeCreated
                                    name={item.title}
                                    quantity={item.quantity}
                                    unit={item.unit}
                                    id={Number(item.id)}
                                    // userMealId={item.userMealId}
                                    calories={item.calories}
                                    handleDelete={()=> handleDeleteFoodCreated(item.originalMealId)}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            // keyExtractor={(item) => item.userMealId ? item.userMealId : item.id.toString()}
                        />
                        )
                    }
                </Row>
                {resultMeal.length === 0 && resultMealCreated.length === 0 && (
                    <Row>
                        <ThemedText color={colors.black}>Don't have any food for {meal}</ThemedText>
                    </Row>
                )}
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