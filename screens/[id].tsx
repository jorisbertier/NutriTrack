import { ThemedText } from "@/components/ThemedText"
import { Image, Pressable, StyleSheet, View, ScrollView, ActivityIndicator, Button } from "react-native";
import { useNavigation } from "expo-router";
import Row from "@/components/Row";
import NutritionStatCard from "@/components/Screens/Details/NutritionStatCard";
import { Dimensions } from "react-native";
import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from "@/interface/FoodItem";
import { useTheme } from "@/hooks/ThemeProvider";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import { TextInput } from "react-native";
import { fetchUserDataConnected, getTodayDate } from "@/functions/function";
import { User } from "@/interface/User";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";

const { height } = Dimensions.get('window');

export default function DetailsFood() {

    const {theme, colors} = useTheme();

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const route = useRoute<any>();
    const { id } = route.params;


    const [quantityGrams, setQuantityGrams] = useState('100');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FoodItem[]>([]);

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserDataConnected(user, setUserData)
            }
            fetch()
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, [user]);

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

    const filterUniqueFood = data.find((element) => element.id === id)

    const values = [filterUniqueFood?.proteins, filterUniqueFood?.carbohydrates, filterUniqueFood?.fats]
    values.sort((a, b) => a - b);
    
    const associations = { [values[0]]: 65, [values[1]]: 90, [values[2]]: 120 };

    const associatedValues = {
        proteins: associations[filterUniqueFood?.proteins],
        carbohydrates: associations[filterUniqueFood?.carbohydrates],
        fats: associations[filterUniqueFood?.fats],
    };

    const today = getTodayDate();

    const handleCreateAliment = async () => {
        const userId = userData[0]?.id;
        const foodId = filterUniqueFood?.id;
        try {
            const test = {
                userId: userId,
                quantityCustom: quantityGrams,
                foodId: foodId,
                date: today,
                mealType: "Breakfast"
    
            }
            console.log(test)

            await addDoc(collection(firestore, "UserMealsCustom"), {
                userId,
                foodId,
                quantityCustom: quantityGrams,
                date: today,
                mealType: "Breakfast"
            });

            console.log("Aliment ajouté avec succès");
            // navigation.goBack();
        } catch (error) {
            console.error("Erreur lors de l’ajout :", error);
        }
        }
        const calculateValue = (baseValue: number | undefined, quantity: string) => {
            if (!baseValue || isNaN(Number(quantity))) return 0;
            const qty = parseFloat(quantity);
            return Math.round((baseValue * qty) / 100 * 10) / 10;
        };

    return (
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
                <ThemedText color={colors.black} style={[styles.subtitle, {borderColor: colors.grayDark}]} variant='title1'>{filterUniqueFood?.quantity + " " + filterUniqueFood?.unit}</ThemedText>
                <ThemedText color={colors.black} variant="title1" style={styles.title}>
                {filterUniqueFood?.unit === "g"
                    ? `${calculateValue(filterUniqueFood?.calories, quantityGrams || "0")} kcal`
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
            <Text style={{fontSize: 16, margin: 'auto', fontWeight: 500, textAlign: 'center', width: '90%'}}>{filterUniqueFood?.description}</Text>
            <View style={[styles.container]}>
                <Row gap={10}>
                    <NutritionStatCard
                        nutri={t('proteins')}
                        quantity={
                            filterUniqueFood?.unit === "g"
                                ? calculateValue(filterUniqueFood?.proteins || 0, quantityGrams || "0")
                                : filterUniqueFood?.proteins || 0
                        }
                        unit={'g'}
                        height={associatedValues["proteins"]}
                        source={require('@/assets/images/nutritional/meat.png')}
                    />
                    <NutritionStatCard
                        nutri={t('carbs')}
                        quantity={
                            filterUniqueFood?.unit === "g"
                                ? calculateValue(filterUniqueFood?.carbohydrates || 0, quantityGrams || "0")
                                : filterUniqueFood?.carbohydrates || 0
                        }
                        unit={'g'}
                        height={associatedValues["carbohydrates"]}
                        source={require('@/assets/images/nutritional/cutlery.png')}
                    />
                    <NutritionStatCard
                        nutri={t('fats')}
                        quantity={
                            filterUniqueFood?.unit === "g"
                                ? calculateValue(filterUniqueFood?.fats || 0, quantityGrams || "0")
                                : filterUniqueFood?.fats || 0
                        }
                        unit={'g'}
                        height={associatedValues["fats"]}
                        source={require('@/assets/images/nutritional/water.png')}
                    />
                </Row>
            </View>
            {filterUniqueFood?.unit === "g" && (
                <View style={[styles.quantityBlock, { borderColor: colors.grayDark, backgroundColor: colors.white }]}>
                    <Text style={[styles.quantityLabel, { color: colors.black}]}>
                        Portion en grammes
                        {/* {t('quantity_in_grams') || "Quantity (g)"} */}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                    <TextInput
                        keyboardType="numeric"
                        value={quantityGrams}
                        onChangeText={text => {
                        if (/^\d*$/.test(text)) {
                            setQuantityGrams(text);
                        }
                        }}
                        style={[styles.quantityInput, { borderColor: colors.black + '30', color: colors.black }]}
                        placeholder="100"
                        maxLength={3}
                    />
                    <Text style={[styles.quantityLabel, { color: colors.black}]}>
                        g
                    </Text>
                    </View>
                    <Button title="add" onPress={handleCreateAliment}/>
                </View>
            )}
            <View style={{flexDirection: 'column'}}>
                {filterUniqueFood?.proteins ? <NutritionItem name={t('proteins')} quantity={filterUniqueFood?.proteins } unit={'g'}/> : null}
                {filterUniqueFood?.carbohydrates ? <NutritionItem name={t('carbs')} quantity={filterUniqueFood?.carbohydrates} unit={'g'}/> : null}
                {filterUniqueFood?.fats ? <NutritionItem name={t('fats')} quantity={filterUniqueFood?.fats}  unit={'g'}/> : null}

                {filterUniqueFood?.potassium ? <NutritionItem name={t('potassium')} quantity={filterUniqueFood?.potassium} unit={'g'}/> : null}
                {filterUniqueFood?.magnesium ? <NutritionItem name={t('magnesium')} quantity={filterUniqueFood?.magnesium} unit={'g'}/> : null}
                {filterUniqueFood?.calcium ? <NutritionItem name={t('calcium')} quantity={filterUniqueFood?.calcium} unit={'g'}/> : null}
                {filterUniqueFood?.sodium ? <NutritionItem name={t('sodium')} quantity={filterUniqueFood?.sodium} unit={'g'}/> : null}
                {filterUniqueFood?.iron ? <NutritionItem name={t('iron')} quantity={filterUniqueFood?.iron} unit={'g'}/> : null}
                {filterUniqueFood?.folate ? <NutritionItem name={t('folate')} quantity={filterUniqueFood?.folate} unit={'%'}/> : null}
                
                {filterUniqueFood?.vitaminA ? <NutritionItem name={t('vitaminA')} quantity={filterUniqueFood?.vitaminA} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB1 ? <NutritionItem name={t('itaminB1')} quantity={filterUniqueFood?.vitaminB1} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB5 ? <NutritionItem name={t('vitaminB5')} quantity={filterUniqueFood?.vitaminB5} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB6 ? <NutritionItem name={t('vitaminB6')} quantity={filterUniqueFood?.vitaminB6} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB12 ? <NutritionItem name={t('vitaminB12')} quantity={filterUniqueFood?.vitaminB12} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminC ? <NutritionItem name={t('vitaminC')} quantity={filterUniqueFood?.vitaminC} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminD ? <NutritionItem name={t('vitaminD')} quantity={filterUniqueFood?.vitaminD} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminE ? <NutritionItem name={t('vitaminE')} quantity={filterUniqueFood?.vitaminE} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminK ? <NutritionItem name={t('vitaminK')} quantity={filterUniqueFood?.vitaminK} unit={'%'}/> : null}

                
            </View>
        </View>
    </ScrollView>
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
})