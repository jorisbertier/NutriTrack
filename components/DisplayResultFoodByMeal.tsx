
import { ThemedText } from "./ThemedText";
import Row from "./Row";
import { FoodItem } from '../interface/FoodItem';
import { FlatList, StyleSheet, View } from "react-native";
import CardFoodResume from "./Screens/Dashboard/CardFoodResume";
import { useTheme } from "@/hooks/ThemeProvider";
import { FoodItemCreated } from '../interface/FoodItemCreated';
import CardFoodResumeCreated from "./Screens/Dashboard/CardFoodResumeCreated";
import { Skeleton } from "moti/skeleton";
import UUID from 'react-native-uuid';
import { useTranslation } from "react-i18next";
import CardFoodResumeCustom from "./Screens/Dashboard/CardFoodResumeCustom";
import { FoodItemQr } from "@/interface/FoodItemQr";
import CardFoodResumeQr from "./Screens/Dashboard/CardFoodResumeQr";

export function DisplayResultFoodByMeal(
    resultMeal: FoodItem[],
    resultMealCreated: FoodItem[],
    resultMealCustom: FoodItemCreated [],
    resultMealQr: FoodItemQr[],
    meal: string,
    handleDeleteFood: (userMealId: string) => void,
    handleDeleteFoodCreated: (userMealId: string) => void,
    handleDeleteFoodCustom: (userMealId: string) => void,
    handleDeleteFoodQr: (userMealId: string) => void,
    isLoading: boolean = false
) {

    const {colors} = useTheme();
    const { t, i18n } = useTranslation();

    const colorMode: 'light' | 'dark' = 'light';
    
    const totalCaloriesByMeal = resultMeal.reduce((accumulator, item) => {
        return accumulator + (item.calories || 0);
    }, 0);

    const totalCaloriesByMealCreated = resultMealCreated.reduce((accumulator, item) => {
        return accumulator + (item.calories || 0);
    }, 0);

    const totalCaloriesByMealCustom = resultMealCustom.reduce((accumulator, item) => {
        const baseCalories = item.calories || 0;
        const quantity = parseFloat(item.quantityCustom || "0");
        const quantityRef = item.quantity || 100;
        const ratio = quantity / quantityRef;
        return accumulator + (baseCalories * ratio);
    }, 0);
    
    const totalCaloriesByMealQr = resultMealQr.reduce((accumulator, item) => {
        return accumulator + (item.calories || 0);
    }, 0);

    const resultMealWithUuid = resultMeal.map(item => ({
        ...item,
        uuid: UUID.v4() as string,
    }));

    const resultMealCreatedWithUuid = resultMealCreated.map(item => ({
        ...item,
        uuid: UUID.v4() as string,
    }));

    const resultMealCustomWithUuid = resultMealCustom.map(item => ({
        ...item,
        uuid: UUID.v4() as string,
    }));

    const resultMealQrWithUuid = resultMealQr.map(item => ({
        ...item,
        uuid: UUID.v4() as string,
    }));

    return (
        <View style={styles.wrapper}>
            <Row style={styles.row}>
                <ThemedText variant="title" color={colors.black}>{meal}</ThemedText>
                    <ThemedText color={colors.black}>{Math.round(totalCaloriesByMeal + totalCaloriesByMealCreated + totalCaloriesByMealCustom + totalCaloriesByMealQr)} Kcal</ThemedText>
            </Row>
            {isLoading ?
            <>
            <Row>
            { resultMeal.length !== 0 && (
                <FlatList<FoodItem>
                    data={resultMealWithUuid}
                    renderItem={({ item }) => (
                        <CardFoodResume
                        name={`${item[`name_${i18n.language}`] || item.name_en}`}
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
                    keyExtractor={(item) => item.uuid}
                />
                )
                }
                </Row>
                
                <Row>
                    { resultMealCreated.length !== 0 && (
                        <FlatList<FoodItemCreated>
                            data={resultMealCreatedWithUuid}
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
                                    image={item.image}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.uuid}
                        />
                        )
                    }
                    </Row>
                    <Row>
                    { resultMealCustom.length !== 0 && (
                        <FlatList<FoodItem>
                            data={resultMealCustomWithUuid}
                            renderItem={({ item }) => (
                                // <ThemedText>{item.name}</ThemedText>
                                <CardFoodResumeCustom
                                    name={`${item[`name_${i18n.language}`] || item.name_en}`}
                                    quantityCustom={item?.quantityCustom}
                                    proteins={item.proteins}
                                    carbs={item.carbohydrates}
                                    fats={item.fats}
                                    unit={item.unit}
                                    image={item.image}
                                    userMealId={item.userMealId}
                                    calories={item.calories}
                                    handleDelete={()=> handleDeleteFoodCustom(item.userMealId)}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.uuid}
                        />
                        )
                    }
                </Row>
                <Row>
                    { resultMealQr.length !== 0 && (
                        <FlatList<FoodItemQr>
                            data={resultMealQrWithUuid}
                            renderItem={({ item }) => (
                                // <ThemedText>{item.name}</ThemedText>
                                <CardFoodResumeQr
                                    name={item.title}
                                    quantityCustom={item.quantity}
                                    quantity={item.quantity}
                                    proteins={item.proteins}
                                    carbs={item.carbohydrates}
                                    fats={item.fats}
                                    unit={"g"}
                                    image={item.image}
                                    calories={item.calories}
                                    handleDelete={()=> handleDeleteFoodQr(item.id)}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.uuid}
                        />
                        )
                    }
                </Row>
                {resultMeal.length === 0 && resultMealCreated.length === 0 && resultMealCustom.length === 0 && resultMealQr.length === 0 && (
                    <Row>
                        <ThemedText color={colors.black}>{t('dont_have')} {meal}</ThemedText>
                    </Row>
                )}
                </>
                :
                    <Skeleton width={'100%'} height={60} colorMode={colorMode}/>
                }

        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 5
    },
    wrapperFood : {
        marginBottom: 16,
    },
    row: {
        width: '100%',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    }
})