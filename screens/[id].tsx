import { ThemedText } from "@/components/ThemedText"
import { Image, Pressable, StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import Row from "@/components/Row";
import NutritionStatCard from "@/components/Screens/Details/NutritionStatCard";
import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from "@/interface/FoodItem";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import BottomInputBar from "@/components/BottomBar";
import LottieView from "lottie-react-native";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { updateMacronutrients, updateUserCaloriesByDay } from "@/redux/userSlice";

export default function DetailsFood() {

    const {theme, colors} = useTheme();

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const route = useRoute<any>();
    const { id, date } = route.params;

    const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

    const [quantityGrams, setQuantityGrams] = useState('100');
    const [selectedMealType, setSelectedMealType] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FoodItem[]>([]);
    const [loadingCreateAliment, setLoadingCreateAliment] = useState(false)

    const dispatch = useDispatch();
    const userRedux = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        try {
                setData(foodData);
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, []);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const nutrients = [
        { key: 'proteins', label: t('proteins'), unit: 'g' },
        { key: 'carbohydrates', label: t('carbs'), unit: 'g' },
        { key: 'fats', label: t('fats'), unit: 'g' },
        { key: 'potassium', label: t('potassium'), unit: 'g' },
        { key: 'magnesium', label: t('magnesium'), unit: 'g' },
        { key: 'calcium', label: t('calcium'), unit: 'g' },
        { key: 'sodium', label: t('sodium'), unit: 'g' },
        { key: 'iron', label: t('iron'), unit: 'g' },
        { key: 'folate', label: t('folate'), unit: '%' },
        { key: 'vitaminA', label: t('vitaminA'), unit: '%' },
        { key: 'vitaminB1', label: t('vitaminB1'), unit: '%' },
        { key: 'vitaminB5', label: t('vitaminB5'), unit: '%' },
        { key: 'vitaminB6', label: t('vitaminB6'), unit: '%' },
        { key: 'vitaminB12', label: t('vitaminB12'), unit: '%' },
        { key: 'vitaminC', label: t('vitaminC'), unit: '%' },
        { key: 'vitaminD', label: t('vitaminD'), unit: '%' },
        { key: 'vitaminE', label: t('vitaminE'), unit: '%' },
        { key: 'vitaminK', label: t('vitaminK'), unit: '%' },
    ];


    const filterUniqueFood = data.find((element) => element.id === id)

    const values = [filterUniqueFood?.proteins, filterUniqueFood?.carbohydrates, filterUniqueFood?.fats]
    values.sort((a, b) => a - b);
    
    const associations = { [values[0]]: 65, [values[1]]: 90, [values[2]]: 120 };

    const associatedValues = {
        proteins: associations[filterUniqueFood?.proteins],
        carbohydrates: associations[filterUniqueFood?.carbohydrates],
        fats: associations[filterUniqueFood?.fats],
    };

    const handleCreateAliment = async () => {
        const userId = userRedux?.id;
        const foodId = filterUniqueFood?.id;

        try {

            await addDoc(collection(firestore, "UserMealsCustom"), {
                userId,
                foodId,
                quantityCustom: quantityGrams,
                date: date,
                mealType: selectedMealType
            });

            const normalizedDate = date.includes('-') 
                ? date 
                : date.split('/').reverse().join('-');
                    dispatch(updateUserCaloriesByDay({
            consumeByDays: {
                ...userRedux?.consumeByDays,
                [normalizedDate]: (userRedux?.consumeByDays?.[normalizedDate] || 0) + (filterUniqueFood?.calories ?? 0)
                }
            }));

            dispatch(updateMacronutrients({
                proteinsTotal: {
                    ...userRedux?.proteinsTotal,
                    [normalizedDate]: (userRedux?.proteinsTotal?.[normalizedDate] || 0) + (filterUniqueFood?.proteins ?? 0)
                },
                carbsTotal: {
                    ...userRedux?.carbsTotal,
                    [normalizedDate]: (userRedux?.carbsTotal?.[normalizedDate] || 0) + (filterUniqueFood?.carbohydrates ?? 0)
                },
                fatsTotal: {
                    ...userRedux?.fatsTotal,
                    [normalizedDate]: (userRedux?.fatsTotal?.[normalizedDate] || 0) + (filterUniqueFood?.fats ?? 0)
                }
            }));

            setLoadingCreateAliment(true);
            setTimeout(() => setLoadingCreateAliment(false), 2400);
        } catch (error) {
            console.error("Erreur lors de l’ajout :", error);
        }
        }
        const calculateValueWithOneDecimal = (baseValue: number | undefined, quantity: string) => {
            if (!baseValue || isNaN(Number(quantity))) return 0;
            const qty = parseFloat(quantity);
            return Math.round((baseValue * qty) / 100 * 10) / 10;
        };

        const calculateValueRoundingUp = (baseValue: number | undefined, quantity: string) => {
            if (!baseValue || isNaN(Number(quantity))) return 0;
            const qty = parseFloat(quantity);
            return Math.round((baseValue * qty) / 100 * 10 / 10);
        };


    return (
    <>
        <ScrollView persistentScrollbar={true}>
            <View style={styles.banner}>
                {loading && (
                    <ActivityIndicator
                    size="large"
                    color="#999"
                    style={{height: '100%'}}
                    />
                )}
                <Image
                    source={{ uri: filterUniqueFood?.image }}
                    style={styles.image}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                />
                <Pressable onPress={handleGoBack} style={[styles.back, {backgroundColor: colors.white}]}>
                    {theme === 'light' ?
                        <Image source={require('@/assets/images/back.png')} style={styles.icon} />
                    :
                        <Image source={require('@/assets/images/backWhite.png')} style={styles.icon} />
                    }
                </Pressable>
            </View>
            <View style={[styles.header, {backgroundColor: colors.white}]}>
                <Row style={styles.wrapperTitle}>
                    <ThemedText color={colors.black} variant="title" style={styles.title}>{filterUniqueFood?.[`name_${i18n.language}`]}</ThemedText>
                    <ThemedText color={colors.black} style={[styles.subtitle, {borderColor: colors.grayDark}]} variant='title1'>{filterUniqueFood?.quantity + " " + t(`units.${filterUniqueFood?.unit}`)}</ThemedText>
                    <ThemedText color={colors.black} variant="title1" style={styles.title}>
                    {(filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml") 
                        ? `${calculateValueRoundingUp(filterUniqueFood?.calories, quantityGrams || "0")} kcal`
                        : `${filterUniqueFood?.calories} kcal`}

                    </ThemedText>
                </Row>
                <Row>
                    <View style={styles.wrapperBlock}>
                        <View style={[styles.modernBlock, { backgroundColor: colors.white, borderColor: colors.black + '20' }]}>
                            <ThemedText color={colors.black} style={styles.textStyle}>
                                {filterUniqueFood?.category}
                            </ThemedText>
                        </View>
                    </View>
                </Row>
                <Text style={{fontSize: 16, margin: 'auto', fontWeight: 500, textAlign: 'center', width: '90%', color: colors.black}}>{filterUniqueFood?.[`description_${i18n.language}`]}</Text>
                <View style={[styles.container]}>
                    <Row gap={10}>
                        <NutritionStatCard
                            nutri={t('proteins')}
                            quantity={
                                (filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml") 
                                    ? calculateValueWithOneDecimal(filterUniqueFood?.proteins || 0, quantityGrams || "0")
                                    : filterUniqueFood?.proteins || 0
                            }
                            unit={'g'}
                            height={associatedValues["proteins"]}
                            source={require('@/assets/images/nutritional/meat.png')}
                        />
                        <NutritionStatCard
                            nutri={t('carbs')}
                            quantity={
                                (filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml") 
                                    ? calculateValueWithOneDecimal(filterUniqueFood?.carbohydrates || 0, quantityGrams || "0")
                                    : filterUniqueFood?.carbohydrates || 0
                            }
                            unit={'g'}
                            height={associatedValues["carbohydrates"]}
                            source={require('@/assets/images/nutritional/cutlery.png')}
                        />
                        <NutritionStatCard
                            nutri={t('fats')}
                            quantity={
                                (filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml") 
                                    ? calculateValueWithOneDecimal(filterUniqueFood?.fats || 0, quantityGrams || "0")
                                    : filterUniqueFood?.fats || 0
                            }
                            unit={'g'}
                            height={associatedValues["fats"]}
                            source={require('@/assets/images/nutritional/water.png')}
                        />
                    </Row>
                </View>
                <View style={{flexDirection: 'column', paddingBottom: (filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml")  ? 90 : 10}}>
                {nutrients.map(({ key, label, unit }) => {
                    const value = filterUniqueFood?.[key];
                    if (!value) return null;

                    const quantity =
                        (filterUniqueFood?.unit === "g" || filterUniqueFood?.unit === "ml") 
                        ? calculateValueWithOneDecimal(value, quantityGrams || '0')
                        : value;

                    return (
                        <NutritionItem
                            keyName={key}
                            key={key}
                            name={label}
                            quantity={quantity}
                            unit={unit}
                            isPremium={isPremium}
                        />
                    );
                })}
                </View>
            </View>
        </ScrollView>
        <BottomInputBar
            filterUniqueFood={filterUniqueFood}
            quantityGrams={quantityGrams}
            setQuantityGrams={setQuantityGrams}
            handleCreateAliment={handleCreateAliment}
            selectedMealType={selectedMealType}
            setSelectedMealType={setSelectedMealType}
            isPremium={isPremium}
            loading={loadingCreateAliment}
        />
    </>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'relative',
        width: '100%',
        height: 350,
    },
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        top: -35,
        
    },
    image: {
        objectFit: 'fill',
        width: '100%',
        height: 350
    },
    back: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 13,
        top: 100,
        left: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 25,
        height: 25
    },
    wrapperBlock: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 0,
        marginBottom: 15,
        justifyContent: 'center',
        width: '50%',
        margin: "auto"
    },
    modernBlock: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        backgroundColor: '#fff',
        margin: 'auto'
    },
    textStyle: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.4,
    },
    block: {
        borderWidth: 1,
        borderRadius: 7,
        padding: 8,
        width: 'auto',
        maxWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapperTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'column',
        overflow: "visible",
    },
    title: {
        height: 50,
    },
    subtitle : {
        marginBottom: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: "100%",
        padding: 20,
        paddingBottom: 40,
        margin: 'auto'
    },
    quantityBlock: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        marginBottom: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    quantityInput: {
        width: 70,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    notification: {
        position: "absolute",
        bottom: 150,
        width: "100%",
        alignItems: "center",
        zIndex: 999
    },
    wrapperNotification: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    notificationText: {
        color: "#333",
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
        marginRight: 10
    },
})