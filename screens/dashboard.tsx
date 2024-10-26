import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View, Image, TouchableOpacity, Animated, ScrollView, Text, Dimensions } from "react-native";
import RNDateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";
import { useState, useEffect, useRef } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from '@/interface/FoodItem';
import { UserMeals } from "@/interface/UserMeals";
import { Users } from "@/data/users";
import { getAuth } from "firebase/auth";
import { fetchUserIdDataConnected, fetchUserDataConnected, BasalMetabolicRate, calculAge, getTotalNutrient, calculProteins, calculCarbohydrates, calculFats, handleAnimation } from "@/functions/function";
import { firestore } from "@/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { DisplayResultFoodByMeal } from "@/components/DisplayResultFoodByMeal";
import { User } from "@/interface/User";
import NutritionList from "@/components/Screens/Dashboard/NutritionList";
import ProgressBar from "@/components/ProgressBar";
import { capitalizeFirstLetter } from "@/functions/function";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import RowDrop from "@/components/Screens/Dashboard/RowDrop";
import { ProgressBarKcal } from "@/components/ProgressBarKcal";
import ProgressRing from "@/components/Chart/ProgressRing";
import { ProgressChart } from "react-native-chart-kit";
import { useHeaderHeight } from "@react-navigation/elements";
import useThemeColors from "@/hooks/useThemeColor";


export default function Dashboard() {

    const [userIdConnected, setUserIdConnected] = useState<number>();
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const colors = useThemeColors()
    const [allFoodData, setAllFoodData] = useState<FoodItem[]>([]);  // all foods
    const [allUserData, setAllUserData] = useState([]);  // all user
    const [allUsersFoodData, setAllUsersFoodData] = useState<UserMeals[]>([]);  // all UsersFoodData
    const [resultAllDataFood, setResultAllDataFood] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByBreakfast, setSortByBreakfast] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByLunch, setSortByLunch] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByDinner, setSortByDinner] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortBySnack, setSortBySnack] = useState<FoodItem[]>([]); //State for stock search filtered
    const [totalKcalConsumeToday, setTotalKcalConsumeToday] = useState<number>(0)

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState<any>(0)
    let date = new Date();
    let newdate = date.toLocaleString()
//     console.log('Date en UTC:', date.toUTCString()); // Affiche la date en UTC
// console.log('Date locale:', date.toLocaleString()); // Affiche la date locale
// console.log('Date locale:', date); // Affiche la date locale

    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        if(date) {
            console.log(event)
            setSelectedDate(date);
            setIsOpen(false)
        }
    };
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
            }
            fetchData()
            setAllFoodData(foodData);
            setAllUserData(Users);
            fetchUserIdDataConnected(user, setUserIdConnected)
            fetchUserDataConnected(user, setUserData)
        } catch (e) {
            console.log('Error processing data', e);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
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
        if (allFoodData.length > 0 && allUsersFoodData.length > 0) {
            const result = allUsersFoodData.filter((allFoodByOneUser) =>
            allFoodByOneUser.userId === userIdConnected && allFoodByOneUser.date === selectedDate.toLocaleDateString());

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
        console.log('update', update)
    }, [selectedDate,allUsersFoodData, userIdConnected, allFoodData]);
    // }, [allUsersFoodData, allFoodData, selectedDate, userIdConnected]);

    const handleOpenCalendar = () => {
        setIsOpen(!isOpen)
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
    
    const calculTotalKcalConsumeToday= () => {
        if (resultAllDataFood.length > 0) {
            const totalKcal = resultAllDataFood.reduce((acc: number, item: FoodItem) => {
                // Ensure that item.nutrition and item.nutrition.calories exist
                return acc + (item.calories || 0); // Use optional chaining and default to 0
            }, 0);
            setTotalKcalConsumeToday(totalKcal);
        } else {
            setTotalKcalConsumeToday(0);
        }
    }

    useEffect(() => {
        calculTotalKcalConsumeToday();
        getTotalNutrient(resultAllDataFood, 'magnesium', setMagnesium)
        getTotalNutrient(resultAllDataFood, 'potassium', setPotassium)
        getTotalNutrient(resultAllDataFood, 'calcium', setCalcium)
        getTotalNutrient(resultAllDataFood, 'sodium', setSodium)
        getTotalNutrient(resultAllDataFood, 'iron', setIron)
        getTotalNutrient(resultAllDataFood, 'vitaminA', setVitaminA)
        getTotalNutrient(resultAllDataFood, 'vitaminB1', setVitaminB1)
        getTotalNutrient(resultAllDataFood, 'vitaminB5', setVitaminB5)
        getTotalNutrient(resultAllDataFood, 'vitaminB6', setVitaminB6)
        getTotalNutrient(resultAllDataFood, 'vitaminB12', setVitaminB12)
        getTotalNutrient(resultAllDataFood, 'vitaminC', setVitaminC)
        getTotalNutrient(resultAllDataFood, 'vitaminD', setVitaminD)
        getTotalNutrient(resultAllDataFood, 'vitaminE', setVitaminE)
        getTotalNutrient(resultAllDataFood, 'vitaminK', setVitaminK)
        getTotalNutrient(resultAllDataFood, 'folate', setFolate)
        getTotalNutrient(resultAllDataFood, 'sugar', setSugar)
        getTotalNutrient(resultAllDataFood, 'proteins', setProteins)
        getTotalNutrient(resultAllDataFood, 'carbohydrates', setCarbs)
        getTotalNutrient(resultAllDataFood, 'fats', setFats)
    }, [resultAllDataFood]);
    console.log('Tout les meals',totalKcalConsumeToday)

    const nutritionData = [
        { name: 'Fiber', quantity: 0, unit: 'g' },
        { name: 'Sugar', quantity: sugar, unit: 'g' },
        { name: 'Vitamin A', quantity: vitaminA, unit: 'g' },
        { name: 'Vitamin B1', quantity: vitaminB1, unit: 'g' },
        { name: 'Vitamin B5', quantity: vitaminB5, unit: 'g' },
        { name: 'Vitamin B6', quantity: vitaminB6, unit: 'g' },
        { name: 'Vitamin B12', quantity: vitaminB12, unit: 'g' },
        { name: 'Vitamin C', quantity: vitaminC, unit: 'g' },
        { name: 'Vitamin D', quantity: vitaminD, unit: 'g' },
        { name: 'Vitamin E', quantity: vitaminE, unit: 'g' },
        { name: 'Vitamin K', quantity: vitaminK, unit: 'g' },
        { name: 'Folate', quantity: folate, unit: 'g' },
        { name: 'Potassium', quantity: potassium, unit: 'g' },
        { name: 'Magnesium', quantity: magnesium, unit: 'g' },
        { name: 'Calcium', quantity: calcium, unit: 'g' },
        { name: 'Sodium', quantity: sodium, unit: 'g' },
        { name: 'Iron', quantity: iron, unit: 'g' },
    ];

         // Crée une référence à Animated.Value
    // const rotateAnimation = useRef(new Animated.Value(0)).current;
    // const [isOpenBreakfast, setIsOpenBreakfast] = useState(true)

    // // Fonction pour déclencher l'animation
    // const handleAnimation = () => {
    //     // La valeur d'animation alterne entre 0 et 1
    //     Animated.timing(rotateAnimation, {
    //         toValue: rotateAnimation._value === 0 ? 1 : 0, // Alterne entre 0 et 1
    //         duration: 400,
    //         useNativeDriver: true,
    //     }).start();
    //     setIsOpenBreakfast(!isOpenBreakfast)
    // };
    
    // // Interpoler la valeur pour transformer la rotation
    // const rotateInterpolate = rotateAnimation.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ['0deg', '-180deg'], // Alterner entre 0 et 180 degrés
    // });

    // const animatedStyle = {
    //     transform: [{ rotate: rotateInterpolate }],
    // };
    const proteinsGoal = calculProteins(Number(userData[0]?.weight)) || 0;
    const carbsGoal = calculCarbohydrates(basalMetabolicRate) || 0;
    const fatsGoal = calculFats(basalMetabolicRate) || 0;
    let percentageProteins = +(proteins / proteinsGoal).toFixed(2);
    const headerheight = useHeaderHeight();
    const totalCaloriesGoal = basalMetabolicRate.toLocaleString('en-US')
    console.log('proteins', typeof proteins)
    console.log('proteins', typeof totalKcalConsumeToday)
    console.log('proteins', selectedDate.toLocaleString())

    return (
        <>
        <View style={{width: '100%', height: 40, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={handleOpenCalendar}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                    <ThemedText variant="title1" style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                        'Today':
                        `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                    </ThemedText>
                    <Image source={require('@/assets/images/chevron-bas.png')} style={{width: 20, height: 20}}/>
                </View>
            </TouchableOpacity>
        </View>
        <ScrollView style={[styles.header, {paddingTop: 30}]}>
                <View style={{flexDirection: 'column',height: 'auto', alignItems:'center', width: '100%', marginBottom: 20}}>
                    {isOpen && (<RNDateTimePicker
                                onChange={setDate}
                                value={selectedDate}
                                timeZoneOffsetInMinutes={new Date().getTimezoneOffset()} 
                    />)}
                    <Image source={require('@/assets/images/nutritional/burnPrimary.png')} style={{width: 35, height: 35}}/>
                    <Text style={[{fontSize: 50, fontWeight: '800', marginTop: 15, fontFamily: 'Oswald', color: colors.black}]}>{totalCaloriesGoal}cal</Text>

                    <ThemedText variant='title2' color={colors.grayDark}>{basalMetabolicRate - totalKcalConsumeToday} left for your goal</ThemedText>
                    <ThemedText variant='title2' style={{marginTop: 5}} color={colors.grayDark}>{totalKcalConsumeToday} / {totalCaloriesGoal} cal</ThemedText>
                </View>
                <View style={{marginBottom: 20}}>
                <ProgressBarKcal progress={proteins} nutri={'Kcal'} quantityGoal={calculProteins(Number(userData[0]?.weight))}/>

                </View>

                <ProgressRing progressProteins={proteins} proteinsGoal={proteinsGoal} progressCarbs={carbs} carbsGoal={calculCarbohydrates(basalMetabolicRate)} progressFats={fats} fatsGoal={calculFats(basalMetabolicRate)}/>
                {/* <ProgressRing progessProteins={proteins} proteinsGoal={proteinsGoal} progressCarbs={carbs} carbsGoal={calculCarbohydrates(basalMetabolicRate)} progressFats={fats} fatsGoal={calculFats(basalMetabolicRate)}/> */}
                {/* <ProgressBar progress={proteins} nutri={'Proteins'} quantityGoal={calculProteins(Number(userData[0]?.weight))}/>
                <ProgressBar progress={carbs} nutri={'Carbs'} quantityGoal={calculCarbohydrates(basalMetabolicRate)}/>
                <ProgressBar progress={fats} nutri={'Fats'} quantityGoal={calculFats(basalMetabolicRate)}/> */}
                {/* <ProgressBar progress={magnesium} nutri={'Carbs'} quantityGoal={300}/>
                <ProgressBar progress={magnesium} nutri={'Fats'} quantityGoal={300}/> */}
 
            {/* <Row>
                {basalMetabolicRate - totalKcalConsumeToday > 0 ? (
                    <ThemedText variant="title">{basalMetabolicRate - totalKcalConsumeToday} kcal restant</ThemedText>
                ) : (
                    <ThemedText variant="title">0 Kcal restant votre objectif est atteint</ThemedText>
                )}
            </Row> */}
            {/* <Row style={styles.wrapperCalendar}>
                <View>
                    <Image source={require('@/assets/images/navbar/home.png')} style={styles.next} />
                </View>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <View style={styles.calendar}>
                            {isOpen && (<RNDateTimePicker
                                onChange={setDate}
                                value={selectedDate}
                                timeZoneOffsetInMinutes={new Date().getTimezoneOffset()} 
                                />)}
                            <ThemedText>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ? 'Aujourd"hui': selectedDate.toLocaleDateString('fr-FR')}</ThemedText>
                            <ThemedText>{selectedDate.toLocaleString()}</ThemedText>
                            <ThemedText>{`${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDay()}, ${selectedDate.getFullYear()}`}</ThemedText>
                    </View>
                </TouchableOpacity>
                <View>
                    <Image source={require('@/assets/images/navbar/home.png')} style={styles.next} />
                </View>
            </Row> */}
            {/* <View>
                <Text>#{userIdConnected}</Text>
            </View> */}
            {isLoading ? <ThemedText>Chargement...</ThemedText> :(
            <View style={styles.wrapperMeals}>
{/* 
                <Row style={styles.row}>
                    <ThemedText variant="title">Breakfast</ThemedText>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20}}>
                        <ThemedText>100 Kcal</ThemedText>
                        <TouchableOpacity onPress={handleAnimation}>
                            <Animated.Image source={require('@/assets/images/chevron-bas.png')} style={[{width: 20, height: 20}, animatedStyle]}/>
                        </TouchableOpacity>
                    </View>
                </Row> */}
                
                    {DisplayResultFoodByMeal(sortByBreakfast, 'Breakfast', handleDeleteFood)}
                    {DisplayResultFoodByMeal(sortByLunch, 'Lunch', handleDeleteFood)}
                    {DisplayResultFoodByMeal(sortByDinner, 'Dinner', handleDeleteFood)}
                    {DisplayResultFoodByMeal(sortBySnack, 'Snack', handleDeleteFood)}
            </View>
            )}
            <NutritionList data={nutritionData}/>
        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        paddingHorizontal: 12,
        paddingBottom: 8,
        backgroundColor: 'white',
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
        backgroundColor: 'yellow'
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
    }
})
