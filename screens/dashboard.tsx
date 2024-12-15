import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View, Image, TouchableOpacity, Animated, ScrollView, Text, Dimensions, FlatList, Alert } from "react-native";
import RNDateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from '@/interface/FoodItem';
import { UserMeals, UserMealsCreated } from "@/interface/UserMeals";
import { Users } from "@/data/users";
import { getAuth } from "firebase/auth";
import { fetchUserDataConnected, BasalMetabolicRate, calculAge, getTotalNutrient, calculProteins, calculCarbohydrates, calculFats, getVitaminPercentageMg, getVitaminPercentageUg, addExperience } from "@/functions/function";
import { firestore } from "@/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { DisplayResultFoodByMeal } from "@/components/DisplayResultFoodByMeal";
import { User } from "@/interface/User";
import NutritionList from "@/components/Screens/Dashboard/NutritionList";
import { capitalizeFirstLetter } from "@/functions/function";
import { ProgressBarKcal } from "@/components/ProgressBarKcal";
import ProgressRing from "@/components/Chart/ProgressRing";
import { useHeaderHeight } from "@react-navigation/elements";
import { Skeleton } from "moti/skeleton";
import { colorMode } from "@/constants/Colors";
import { useTheme } from "@/hooks/ThemeProvider";
import { FoodItemCreated } from "@/interface/FoodItemCreated";


export default function Dashboard() {
    
    const {theme, colors} = useTheme();

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const [allFoodDataCreated, setAllFoodDataCreated] = useState<UserMealsCreated[]>([])
    const [allUserCreatedFoods, setAllUserCreatedFoods] = useState<FoodItemCreated[]>([])

    const [allFoodData, setAllFoodData] = useState<FoodItem[]>([]);  // all foods
    const [allUserData, setAllUserData] = useState([]);  // all user
    const [allUsersFoodData, setAllUsersFoodData] = useState<UserMeals[]>([]);  // all UsersFoodData
    const [resultAllDataFood, setResultAllDataFood] = useState<FoodItem[]>([]); //State for stock search filtered
    const [foodsForSelectedDate, setFoodsForSelectedDate]= useState<FoodItemCreated[]>([])

    const [sortByBreakfast, setSortByBreakfast] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByLunch, setSortByLunch] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByDinner, setSortByDinner] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortBySnack, setSortBySnack] = useState<FoodItem[]>([]); //State for stock search filtered

    const [resultBreakfastCreated, setResultBreakfastCreated] = useState<FoodItemCreated[]>([])
    const [resultLunchCreated, setResultLunchCreated] = useState<FoodItemCreated[]>([])
    const [resultDinnerCreated, setResultDinnerCreated] = useState<FoodItemCreated[]>([])
    const [resultSnackCreated, setResultSnackCreated] = useState<FoodItemCreated[]>([])

    const [totalKcalConsumeToday, setTotalKcalConsumeToday] = useState<number>(0)

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true);
    const [notificationVisible, setNotificationVisible] = useState(false); 

    let date = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    useEffect(()=> {

    }, [sortByBreakfast])
    
    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        setIsOpen(false)
        if(date) {
            // const offsetInMinutes = new Date().getTimezoneOffset();
            // console.log(offsetInMinutes)
            // const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            setSelectedDate(date);
        }
    };

    /*ID user*/
    /* API */
    useEffect(() => {
        try {
            const fetchData = async () => {
                const userMealsCollection = collection(firestore, 'UserMeals');
                const userMealsSnapshot = await getDocs(userMealsCollection);
                const userMealsList = userMealsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    foodId: doc.data().foodId as number,
                    userId: doc.data().userId as number,
                    mealType: doc.data().mealType as string,
                    date: doc.data().date as string,
                }));
                setAllUsersFoodData(userMealsList)

                const userMealsCreatedCollection = collection(firestore, 'UserMealsCreated');
                const userMealsCreatedSnapshot = await getDocs(userMealsCreatedCollection);
                const userMealsCreatedList = userMealsCreatedSnapshot.docs.map(doc => ({
                    id: doc.id,
                    foodId: doc.data().foodId as string,
                    userId: doc.data().userId as number,
                    mealType: doc.data().mealType as string,
                    date: doc.data().date as string,
                }));

                setAllFoodDataCreated(userMealsCreatedList)

                const userCreatedFoodsCollection = collection(firestore, 'UserCreatedFoods');
                const userCreatedFoodsSnapshot = await getDocs(userCreatedFoodsCollection);
                const userCreatedFoodsList = userCreatedFoodsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    idUser: doc.data().idUser as number,
                    calories: doc.data().calories as number,
                    carbohydrates: doc.data().carbohydrates as number,
                    fats: doc.data().fats as number,
                    proteins: doc.data().proteins as number,
                    quantity: doc.data().quantity as number,
                    title: doc.data().title as string,
                    unit: doc.data().unit as string,
                    magnesium: doc.data().magnesium as number,
                    potassium: doc.data().potassium as number,
                    vitaminA: doc.data().vitaminA as number,
                    vitaminB1: doc.data().vitaminB1 as number,
                    vitaminB5: doc.data().vitaminB5 as number,
                    vitaminB6: doc.data().vitaminB6 as number,
                    vitaminB12: doc.data().vitaminB12 as number,
                    vitaminC: doc.data().vitaminC as number,
                    vitaminD: doc.data().vitaminD as number,
                    vitaminE: doc.data().vitaminE as number,
                    vitaminK: doc.data().vitaminK as number,
                    calcium: doc.data().calcium as number,
                    sodium: doc.data().sodium as number,
                    iron: doc.data().iron as number,
                    sugar: doc.data().sugar as number,
                    folate: doc.data().folate as number,

                }));

                setAllUserCreatedFoods(userCreatedFoodsList)

                setIsLoading(false)
            }
            fetchData()
            setAllFoodData(foodData);
            setAllUserData(Users);
            fetchUserDataConnected(user, setUserData)
        } catch (e) {
            console.log('Error processing data', e);
            setIsLoading(false);
        }finally {
            setTimeout(() => {
                
            }, 1500)
        }
    }, []);

    console.log(userData)

    useEffect(() => {
        // const fetchData = async () => {
            // try {
                /* Add created food created by one user */
                /*get all foods meals & date by a user by a id user connected */
                const userConnectedUserMealsCreated = allFoodDataCreated.filter(food => food.userId === userData[0]?.id)

                /* get all foods created by user by a id user connected */
                const userConnectedUserCreatedFoods = allUserCreatedFoods.filter(food => food.idUser === userData[0]?.id )
                /**/
                const mealsForSelectedDate = userConnectedUserMealsCreated.filter(meal => 
                    meal.date === selectedDate.toLocaleDateString() && meal.id
                );
                const foodsForSelectedDate = mealsForSelectedDate.map(meal => {
                    const foodDetails = userConnectedUserCreatedFoods.find(food => food.id === meal.foodId);
                    return {
                        ...meal,
                        ...foodDetails,
                        originalMealId: meal.id,
                    };
                });

                const resultBreakfastCreated = foodsForSelectedDate.filter(food => food.mealType === 'Breakfast');
                const resultLunchCreated = foodsForSelectedDate.filter(food => food.mealType === 'Lunch');
                const resultDinnerCreated = foodsForSelectedDate.filter(food => food.mealType === 'Dinner');
                const resultSnackCreated = foodsForSelectedDate.filter(food => food.mealType === 'Snack');

                
                setFoodsForSelectedDate(foodsForSelectedDate)
                setResultBreakfastCreated(resultBreakfastCreated)
                setResultLunchCreated(resultLunchCreated)
                setResultDinnerCreated(resultDinnerCreated)
                setResultSnackCreated(resultSnackCreated)
        //     } catch (error) {
        //         console.log("Error getting data user food created")
        //     }
        //     finally {
        //         setTimeout(() => {

        //             setIsLoadingCreated(false)
        //         },1500)
        //     }
        // }
        // fetchData()
    }, [allFoodDataCreated, allUserCreatedFoods, selectedDate, userData])

    
    useEffect(() => {
        // function qui permet de filter les données recus et de recuperer les details
        const filterAndSetFoodData = (filteredData: UserMeals[], setData: React.Dispatch<React.SetStateAction<FoodItem[]>>) => {
            if (filteredData.length > 0) {
                // Conservez les deux propriétés : foodId et userMealId
                const filteredFoodData = filteredData.flatMap(item => {
                    const foodDetails = allFoodData.filter(food => food.id === item.foodId);
                    // Ajoutez l'ID du document UserMeals à chaque objet de données filtrées
                    return foodDetails.map(food => ({
                        ...food,
                        userMealId: item.id // Ajoutez ici l'ID du document UserMeals
                    }));
                });
                setData(filteredFoodData); // Update state with filtered data search
            }  else {
                setData([])
            }
        }
        // filter data foods user with Id = 1
        
        if (allFoodData.length > 0 && allUsersFoodData.length > 0 && userData[0]?.id) {
            const result = allUsersFoodData.filter((allFoodByOneUser) =>
            allFoodByOneUser.userId === userData[0]?.id && allFoodByOneUser.date === selectedDate.toLocaleDateString());

            const resultByBreakfast = result.filter((food) => food.mealType === 'Breakfast');
            const resultByLunch = result.filter((food) => food.mealType === 'Lunch');
            const resultByDinner = result.filter((food) => food.mealType === 'Dinner');
            const resultBySnack = result.filter((food) => food.mealType === 'Snack');

            filterAndSetFoodData(result, setResultAllDataFood)
            filterAndSetFoodData(resultByBreakfast, setSortByBreakfast)
            filterAndSetFoodData(resultByLunch, setSortByLunch)
            filterAndSetFoodData(resultByDinner, setSortByDinner)
            filterAndSetFoodData(resultBySnack, setSortBySnack)
        }
    }, [selectedDate, allUsersFoodData, userData, allFoodData]);
    // }, [allUsersFoodData, allFoodData, selectedDate, userIdConnected]);

    const handleOpenCalendar = () => {
        if (!isOpen) {
            setIsOpen(true);
        }
    }

    const handleDeleteFood = (userMealId: any) => {
        console.log(`Deleting food with ID: ${userMealId}`);
        const deleteFromMeals = async () => {
            if (userMealId) { // Verify is userMealId is defined
                try {
                    const mealDocRef = doc(firestore, "UserMeals", userMealId);
                    await deleteDoc(mealDocRef);
                    setAllUsersFoodData(prevData => prevData.filter(item => item.id !== userMealId));
                    // setUpdate(update + 1)
                    console.log('Document supprimé avec succès');
                } catch (error) {
                    console.error("Erreur lors de la suppression du document : ", error);
                }
            } else {
                console.error("L'ID de l'utilisateur du repas est indéfini.");
            }
        };
        deleteFromMeals()
    }

    const handleDeleteFoodCreated = (userMealId: any) => {
        console.log(`Deleting food with ID: ${userMealId}`);
        const deleteFromMeals = async () => {
            if (userMealId) { // Verify is userMealId is defined
                try {
                    const mealDocRef = doc(firestore, "UserMealsCreated", userMealId);
                    await deleteDoc(mealDocRef);
                    setAllFoodDataCreated(prevData => prevData.filter(item => item.id !== userMealId));
                    console.log('Document supprimé avec succès');
                } catch (error) {
                    console.error("Erreur lors de la suppression du document : ", error);
                }
            } else {
                console.error("L'ID de l'utilisateur du repas est indéfini.");
            }
        };
        deleteFromMeals()
    }

    const basalMetabolicRate = userData.length > 0 ? BasalMetabolicRate(
        Number(userData[0]?.weight),
        Number(userData[0]?.height),
        Number(calculAge(userData[0]?.dateOfBirth)),
        userData[0]?.gender,
        userData[0]?.activityLevel
    ) : 0;

    const [magnesium, setMagnesium] = useState(0)
    const [potassium, setPotassium] = useState(0);
    const [calcium, setCalcium] = useState(0);
    const [sodium, setSodium] = useState(0);
    const [iron, setIron] = useState(0);
    const [vitaminA, setVitaminA] = useState(0);
    const [vitaminB1, setVitaminB1] = useState(0);
    const [vitaminB5, setVitaminB5] = useState(0);
    const [vitaminB6, setVitaminB6] = useState(0);
    const [vitaminB12, setVitaminB12] = useState(0);
    const [vitaminC, setVitaminC] = useState(0);
    const [vitaminD, setVitaminD] = useState(0);
    const [vitaminE, setVitaminE] = useState(0);
    const [vitaminK, setVitaminK] = useState(0);
    const [folate, setFolate] = useState(0);
    const [sugar, setSugar] = useState(0);
    const [proteins, setProteins] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fats, setFats] = useState(0);


    useEffect(() => {

        let totalKcal = 0;
            if (resultAllDataFood.length > 0 && userData[0]?.id && selectedDate) {
                const totalKcalDatabase = resultAllDataFood.reduce((acc: number, item: FoodItem) => {
                    // Ensure that item.nutrition and item.nutrition.calories exist
                    return acc + (item.calories || 0); // Use optional chaining and default to 0
                }, 0);
                totalKcal += totalKcalDatabase;
            }
            if (allFoodDataCreated.length > 0 && userData[0]?.id && selectedDate) {
                const totalKcalCreated = foodsForSelectedDate.reduce((acc: number, item: FoodItemCreated) => {
                    return acc + (item.calories || 0)
                }, 0)
                totalKcal += Number(totalKcalCreated);
            }
        setTotalKcalConsumeToday(totalKcal);
    }, [allFoodDataCreated, resultAllDataFood, selectedDate, foodsForSelectedDate, userData]);

    useEffect(() => {
        getTotalNutrient(resultAllDataFood, 'magnesium', setMagnesium, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'potassium', setPotassium, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'calcium', setCalcium, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'sodium', setSodium, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'iron', setIron, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminA', setVitaminA, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminB1', setVitaminB1, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminB5', setVitaminB5, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminB6', setVitaminB6, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminB12', setVitaminB12, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminC', setVitaminC, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminD', setVitaminD, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminE', setVitaminE, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'vitaminK', setVitaminK, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'folate', setFolate, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'sugar', setSugar, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'proteins', setProteins, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'carbohydrates', setCarbs, foodsForSelectedDate)
        getTotalNutrient(resultAllDataFood, 'fats', setFats, foodsForSelectedDate)
    }, [resultAllDataFood, foodsForSelectedDate]);


    const nutritionData = [
        { name: 'Potassium', quantity: potassium, unit: 'g' },
        { name: 'Magnesium', quantity: magnesium, unit: 'g' },
        { name: 'Calcium', quantity: calcium, unit: 'g' },
        { name: 'Sodium', quantity: sodium, unit: 'g' },
        { name: 'Vitamin A', quantity: getVitaminPercentageUg(vitaminA, 800), unit: '%' },
        { name: 'Vitamin B1', quantity: getVitaminPercentageMg(vitaminB1, 1.1), unit: '%' },
        { name: 'Vitamin B5', quantity: getVitaminPercentageMg(vitaminB5, 5), unit: '%' },
        { name: 'Vitamin B6', quantity: getVitaminPercentageMg(vitaminB6, 1.3), unit: '%' },
        { name: 'Vitamin B12', quantity: getVitaminPercentageUg(vitaminB12, 2.4), unit: '%' },
        { name: 'Vitamin C', quantity: getVitaminPercentageMg(vitaminC, 90), unit: '%' },
        { name: 'Vitamin D', quantity: getVitaminPercentageUg(vitaminD, 15), unit: '%' },
        { name: 'Vitamin E', quantity: getVitaminPercentageMg(vitaminE, 15), unit: '%' },
        { name: 'Vitamin K', quantity: getVitaminPercentageUg(vitaminK, 120), unit: '%' },
        { name: 'Folate', quantity: folate, unit: 'g' },
        { name: 'Iron', quantity: iron, unit: 'g' },
        // { name: 'Fiber', quantity: 0, unit: 'g' },
        { name: 'Sugar', quantity: sugar, unit: 'g' },
    ];

    const proteinsGoal = calculProteins(Number(userData[0]?.weight)) || 0;
    const totalCaloriesGoal = basalMetabolicRate.toLocaleString('en-US')

    let goal = basalMetabolicRate - totalKcalConsumeToday;
    if (goal < 0) {
        goal = 0
    }

    console.log('selecteddate', selectedDate.toLocaleDateString())
    console.log('date day',  date.toLocaleDateString())
    const handleXPUpdate = async () => {
        // if (!totalKcalConsumeToday || !basalMetabolicRate) {
        //     alert("Les valeurs de consommation de calories et de métabolisme de base doivent être définies.");
        //     return;
        // }

        // Checks if XP can be added based on calories consumed
        if (totalKcalConsumeToday >= basalMetabolicRate && selectedDate.toLocaleDateString() === date.toLocaleDateString()) {
            console.log("Gain XP : ", totalKcalConsumeToday + "/" + basalMetabolicRate);

            try {
                if (userData) {
                    const today = selectedDate.toLocaleDateString().replace(/\//g, "-");
                    const xpToday = userData[0]?.xpLogs[today] || 0;

                    // To verify is user if the user has already reached the XP goal for the day (maximum 20 XP)
                    if (xpToday < 20) {
                        // Calcul XP to add(limit dairy of 20 XP)
                        const xpToAdd = Math.min(20 - xpToday, 20); // add max 20 xp each day
                        
                        await addExperience(userData[0]?.id, xpToAdd, today);
                        
                        setNotificationVisible(true)

                        setTimeout(() => {
                            setNotificationVisible(false)
                        }, 2200);
                    } else {
                        console.log("L'XP maximum de 20 est déjà atteint aujourd'hui.");
                    }
                }
            } catch (error) {
                console.error("Erreur lors de l'ajout d'XP :", error);
            }
        } else {
            console.log("Pas de gain d'XP", totalKcalConsumeToday + "/" + basalMetabolicRate);
        }
    };

    // Surveillance de l'état de la consommation de calories et du métabolisme de base
    useEffect(() => {
        // Exécuter la fonction handleXPUpdate dès que ces valeurs sont disponibles
        if (totalKcalConsumeToday > 0 && basalMetabolicRate > 0) {
            handleXPUpdate();
        }
    }, [totalKcalConsumeToday, basalMetabolicRate]); 
    
    return (
        <>
            <View style={{width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.grayMode}}>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                        <ThemedText variant="title1" color={colors.black} style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                            'Today':
                            `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                        </ThemedText>
                        {theme === "light" ?
                            <Image source={require('@/assets/images/chevron-bas.png')} style={{width: 20, height: 20}}/>
                            :
                            <Image source={require('@/assets/images/chevronWhite.png')} style={{width: 20, height: 20}}/>
                            }
                    </View>
                </TouchableOpacity>
            {notificationVisible &&
                <View style={styles.notification}>
                    <View style={[styles.wrapperNotification, {backgroundColor: "#8592F2"}]}>
                        <Text style={styles.notificationText}>Daily goal complete !!! + 20 Xp learned !</Text>
                    </View>
                </View>
            }
            </View>
            <ScrollView style={[styles.header, {paddingTop: 20, backgroundColor: colors.whiteMode}]}>
                <View style={{flexDirection: 'column',height: 'auto', alignItems:'center', width: '100%', marginBottom: 20}}>
                    {isOpen && (<RNDateTimePicker
                                onChange={setDate}
                                value={selectedDate}
                                timeZoneName={timeZone}
                    />)}
                    {!isLoading ?
                        <Text style={[{fontSize: 50, fontWeight: '800', marginTop: 15, fontFamily: 'Oswald', color: colors.black}]}>{totalCaloriesGoal}cal</Text>
                    :
                        <View style={{ marginTop: 10 }}><Skeleton width={300} height={40} colorMode={colorMode} /></View>
                    }
                    {!isLoading ?
                        <ThemedText variant='title2' color={colors.grayDark}>{goal} left for your goal</ThemedText>
                    :
                        <View style={{ marginTop: 5 }}><Skeleton width={260} height={30} colorMode={colorMode} /></View>
                    }
                    {!isLoading ?
                        <ThemedText variant='title2' style={{marginTop: 5}} color={colors.grayDark}>{totalKcalConsumeToday} / {totalCaloriesGoal} cal</ThemedText>
                    :
                        <View style={{ marginTop: 5 }}><Skeleton width={230} height={30} colorMode={colorMode} /></View>
                    }
                </View>
                <View style={{marginBottom: 20}}>
                    <ProgressBarKcal isLoading={!isLoading} progress={totalKcalConsumeToday} nutri={'Kcal'} quantityGoal={basalMetabolicRate}/>
                </View>
                <ProgressRing isLoading={!isLoading} progressProteins={proteins} proteinsGoal={proteinsGoal} progressCarbs={carbs} carbsGoal={calculCarbohydrates(basalMetabolicRate)} progressFats={fats} fatsGoal={calculFats(basalMetabolicRate)}/>
                
                <View style={styles.wrapperMeals}>
                    {DisplayResultFoodByMeal(sortByBreakfast,resultBreakfastCreated, 'Breakfast', handleDeleteFood, handleDeleteFoodCreated, !isLoading || false )}
                    {DisplayResultFoodByMeal(sortByLunch, resultLunchCreated, 'Lunch', handleDeleteFood, handleDeleteFoodCreated, !isLoading || false)}
                    {DisplayResultFoodByMeal(sortByDinner, resultDinnerCreated, 'Dinner', handleDeleteFood, handleDeleteFoodCreated, !isLoading || false)}
                    {DisplayResultFoodByMeal(sortBySnack,resultSnackCreated, 'Snack', handleDeleteFood, handleDeleteFoodCreated, !isLoading || false)}
                </View>
                
                <View style={{marginBottom: 60}}>
                    <NutritionList data={nutritionData}/>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        paddingHorizontal: 12,
        paddingBottom: 8,
        
    },
    wrapperCalendar: {
        marginTop: 200,
        justifyContent: 'space-between'
    },
    next : {
        width: 25,
        height:25
    },
    calendar : {
        padding: 40,
    },
    wrapperMeals : {
        gap: 16,
        flexDirection: 'column',
        width: '100%',
    },
    wrapperFood : {
        marginBottom: 16,
    },
    row: {
        width: '100%',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    notification: {
        position: "absolute",
        bottom: 20,
        width: '41%',
        alignSelf: 'center',
    },
    wrapperNotification : {
        position: 'absolute',
        zIndex: 3,
        right: 0,
        top: 600,
        left: 0,
        flexDirection: 'row',
        justifyContent:'center',
        gap: 20,
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2, 
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    notificationText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 24
    },
})
