import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import RNDateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from '@/interface/FoodItem';
import { UserMeals, UserMealsCreated, UserMealsCustom } from "@/interface/UserMeals";
import { Users } from "@/data/users";
import { getAuth } from "firebase/auth";
import { fetchUserDataConnected, BasalMetabolicRate, calculAge, getTotalNutrient, calculProteins, calculCarbohydrates, calculFats, addExperience } from "@/functions/function";
import { firestore } from "@/firebaseConfig";
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { DisplayResultFoodByMeal } from "@/components/DisplayResultFoodByMeal";
import { User } from "@/interface/User";
import NutritionList from "@/components/Screens/Dashboard/NutritionList";
import { capitalizeFirstLetter } from "@/functions/function";
import { ProgressBarKcal } from "@/components/ProgressBarKcal";
import ProgressRing from "@/components/Chart/ProgressRing";
import { Skeleton } from "moti/skeleton";
import { colorMode } from "@/constants/Colors";
import { useTheme } from "@/hooks/ThemeProvider";
import { FoodItemCreated } from "@/interface/FoodItemCreated";
import { useDispatch, useSelector } from 'react-redux';
import { updateMacronutrients, updateUserCaloriesByDay, updateUserXp } from "@/redux/userSlice";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { RootState } from "@/redux/store";
import { FoodItemQr } from "@/interface/FoodItemQr";



export default function Dashboard() {
    
    const {theme, colors} = useTheme();
    
    const { t } = useTranslation();
    const isPremium = useSelector((state: RootState) => state.subscription.isPremium);

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const [allFoodDataCreated, setAllFoodDataCreated] = useState<UserMealsCreated[]>([])
    const [allFoodDataCustomFoods, setAllFoodDataCustomFoods] = useState<FoodItemCreated[]>([]) //new to ingretate
    const [allUserCreatedFoods, setAllUserCreatedFoods] = useState<FoodItemCreated[]>([])
    const [ allFoodQrcode, setAllFoodQrcode] = useState<FoodItemQr[]>([]);

    const [allFoodData, setAllFoodData] = useState<FoodItem[]>([]);  // all foods
    const [allUserData, setAllUserData] = useState([]);  // all user

    const [allUsersFoodData, setAllUsersFoodData] = useState<UserMeals[]>([]);  // all UsersFoodData
    const [allUsersFoodDataCustom, setAllUsersFoodDataCustom] = useState<UserMealsCustom[]>([]);  // all UsersFoodData    NEW TO INTRAGETE
    const [resultAllDataFood, setResultAllDataFood] = useState<FoodItem[]>([]); //State for stock search filtered
    const [foodsForSelectedDate, setFoodsForSelectedDate]= useState<FoodItemCreated[]>([])
    const [foodsQrBySelectedDate, setFoodsQrBySelectedDate] = useState<FoodItemQr[]>([]);

    /**MEALS  */
    const [sortByBreakfast, setSortByBreakfast] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByLunch, setSortByLunch] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByDinner, setSortByDinner] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortBySnack, setSortBySnack] = useState<FoodItem[]>([]); //State for stock search filtered

    /** MEALS CUSTOM */
    const [sortByBreakfastCustom, setSortByBreakfastCustom] = useState<FoodItemCreated[]>([]); //State for stock search filtered
    const [sortByLunchCustom, setSortByLunchCustom] = useState<FoodItemCreated[]>([]); //State for stock search filtered
    const [sortByDinnerCustom, setSortByDinnerCustom] = useState<FoodItemCreated[]>([]); //State for stock search filtered
    const [sortBySnackCustom, setSortBySnackCustom] = useState<FoodItemCreated[]>([]); //State for stock search filtered

    /**MEALS CREATED */
    const [resultBreakfastCreated, setResultBreakfastCreated] = useState<FoodItem[]>([])
    const [resultLunchCreated, setResultLunchCreated] = useState<FoodItem[]>([])
    const [resultDinnerCreated, setResultDinnerCreated] = useState<FoodItem[]>([])
    const [resultSnackCreated, setResultSnackCreated] = useState<FoodItem[]>([])

    /**MEALS QR */
    const [resultBreakfastQr, setResultBreakfastQr] = useState<FoodItemQr[]>([])
    const [resultLunchQr, setResultLunchQr] = useState<FoodItemQr[]>([])
    const [resultDinnerQr, setResultDinnerQr] = useState<FoodItemQr[]>([])
    const [resultSnackQr, setResultSnackQr] = useState<FoodItemQr[]>([])

    const [totalKcalConsumeToday, setTotalKcalConsumeToday] = useState<number>(0)

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [updateCounter, setUpdateCounter] = useState(0);

    const showIcon = (userData[0]?.goalLogs?.calories ?? 0) > 0;
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

                const userMealsCustomCollection = collection(firestore, 'UserMealsCustom');
                const userMealsCustomSnapshot = await getDocs(userMealsCustomCollection);
                const userMealsCustomList = userMealsCustomSnapshot.docs.map(doc => ({
                    id: doc.id,
                    foodId: doc.data().foodId as number,
                    userId: doc.data().userId as number,
                    mealType: doc.data().mealType as string,
                    date: doc.data().date as string,
                    quantityCustom: doc.data().quantityCustom as number
                }));
                setAllUsersFoodDataCustom(userMealsCustomList)

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

                const userQrFoodsCollection = collection(firestore, 'UserCreatedFoodsQr');
                const userQrFoodsSnapshot = await getDocs(userQrFoodsCollection);
                const userQrFoodsList = userQrFoodsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    idUser: doc.data().idUser as string,
                    calories: doc.data().calories as number,
                    mealType: doc.data().mealType as string,
                    image: doc.data().image as string,
                    date: doc.data().date as string,
                    carbohydrates: doc.data().carbs as number,
                    fats: doc.data().fats as number,
                    proteins: doc.data().proteins as number,
                    quantity: doc.data().quantity as number,
                    title: doc.data().title as string,
                    unit: doc.data().unit as string,
                    sugar: doc.data().sugar as number,
                }));

                setAllFoodQrcode(userQrFoodsList);
                setIsLoading(false)
            }
            fetchData()
            setAllFoodData(foodData);
            setAllUserData(Users);
            fetchUserDataConnected(user, setUserData)
        } catch (e) {
            console.log('Error processing data', e);
            setIsLoading(false);
        }
    }, []);
    

    if (!allFoodDataCreated) {
        return (
        <View>
            <Text>No user data available</Text>
        </View>
        );
    }
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
                handleTotalKcalConsumeToday()
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

    const [ resultCaloriesCustom, setResultCaloriesCustom] = useState<UserMealsCustom[]>([])
    useEffect(() => {

        const filterAndSetFoodDataCustom = (
            filteredData: UserMealsCustom[],
            setData: React.Dispatch<React.SetStateAction<FoodItem[]>>
        ) => {
            if (filteredData.length > 0) {
                const filteredFoodData = filteredData.flatMap(item => {
                    const foodDetails = allFoodData.filter(food => String(food.id) === String(item.foodId));
                    return foodDetails.map(food => ({
                        ...food,
                        userMealId: item.id,
                        quantityCustom: item.quantityCustom
                    }));
                });
                setData(filteredFoodData);
            } else {
                setData([]);
            }
        };

        const resultCustom = allUsersFoodDataCustom.filter(
            (entry) =>
                entry.userId === userData[0]?.id &&
                entry.date === selectedDate.toLocaleDateString()
        );

        filterAndSetFoodDataCustom(resultCustom,  setResultCaloriesCustom);
        filterAndSetFoodDataCustom(resultCustom.filter(f => f.mealType === 'Breakfast'), setSortByBreakfastCustom);
        filterAndSetFoodDataCustom(resultCustom.filter(f => f.mealType === 'Lunch'), setSortByLunchCustom);
        filterAndSetFoodDataCustom(resultCustom.filter(f => f.mealType === 'Dinner'), setSortByDinnerCustom);
        filterAndSetFoodDataCustom(resultCustom.filter(f => f.mealType === 'Snack'), setSortBySnackCustom);

    }, [updateCounter, selectedDate, userData, allFoodDataCreated]);

    const handleOpenCalendar = () => {
        if (!isOpen) {
            setIsOpen(true);
        }
    }
      useEffect(() => {
                /*get all foods created by user by a id user connected  */
                console.log('user id: ', userData[0]?.id)
                const userConnectedFoodQrcode = allFoodQrcode.filter(food => food.idUser === userData[0]?.id);
                // console.log("get food qr by user", userConnectedFoodQrcode)

                // console.log(selectedDate.toLocaleDateString())
                const mealsForSelectedDate = userConnectedFoodQrcode.filter(meal => 
                    meal?.date === selectedDate.toLocaleDateString()  
                );

                const resultBreakfastQr = mealsForSelectedDate.filter(food => food.mealType === 'Breakfast');
                const resultLunchQr = mealsForSelectedDate.filter(food => food.mealType === 'Lunch');
                const resultDinnerQr = mealsForSelectedDate.filter(food => food.mealType === 'Dinner');
                const resultSnackQr = mealsForSelectedDate.filter(food => food.mealType === 'Snack');

                setFoodsQrBySelectedDate(mealsForSelectedDate)
                setResultBreakfastQr(resultBreakfastQr)
                setResultLunchQr(resultLunchQr)
                setResultDinnerQr(resultDinnerQr)
                setResultSnackQr(resultSnackQr)

    }, [selectedDate, userData, allFoodQrcode])

    const handleDeleteFood = (userMealId: any) => {

        console.log(`Deleting food with ID: ${userMealId}`);
        const deleteFromMeals = async () => {
            if (userMealId) {
                try {
                    const mealDocRef = doc(firestore, "UserMeals", userMealId);
                    await deleteDoc(mealDocRef);
                    setAllUsersFoodData(prevData => prevData.filter(item => item.id !== userMealId));
                    
                    console.log('Document deleted Succefuly');
                } catch (error) {
                    console.error("Error when deleting the document : ", error);
                }
            } else {
                console.error("Id user of mead is undefined");
            }
        };
        deleteFromMeals()
    }

    const handleDeleteFoodCreated = (userMealId: any) => {
        console.log(`Deleting food with ID: ${userMealId}`);
        const deleteFromMeals = async () => {
            if (userMealId) {
                try {
                    const mealDocRef = doc(firestore, "UserMealsCreated", userMealId);
                    await deleteDoc(mealDocRef);

                    setAllFoodDataCreated(prevData => prevData.filter(item => item.id !== userMealId));
                    console.log('Document deleting Succesfuly');
                } catch (error) {
                    console.error("Error when deleting the documentt : ", error);
                }
            } else {
                console.error("Id user meal is undefined");
            }
        };
        deleteFromMeals()
    }

    const handleDeleteFoodCustom = (userMealId: any) => {
        console.log(`Deleting food with ID: ${userMealId}`);
        const deleteFromMeals = async () => {
            if (userMealId) {
                try {
                    const mealDocRef = doc(firestore, "UserMealsCustom", userMealId);
                    await deleteDoc(mealDocRef);
                    setAllUsersFoodDataCustom(prevData => {
                    return prevData.filter(item => {
                        return item.id !== userMealId;
                    });
                });
                setUpdateCounter(prev => prev + 1); 
                    console.log('Document deleted Succefuly');
                } catch (error) {
                    console.error("Error when deleting the document : ", error);
                }
            } else {
                console.error("Id user of meal custom is undefined");
            }
        };
        deleteFromMeals()
    }

    const handleDeleteFoodQr = (userMealId: any) => {
        console.log(`Deleting food with ID: ${userMealId}`);
        console.log('type:', typeof userMealId);
        // console.log(allFoodQrcode)
        const deleteFromMeals = async () => {
            if (userMealId) {
                try {
                    const mealDocRef = doc(firestore, "UserCreatedFoodsQr", userMealId);
                    await deleteDoc(mealDocRef);
                    setAllFoodQrcode(prevData => {
                    return prevData.filter(item => {
                        return item.id !== userMealId;
                    });
                });
                // setUpdateCounter(prev => prev + 1); 
                //     console.log('Document deleted Succefuly');
                } catch (error) {
                    console.error("Error when deleting the document : ", error);
                }
            } else {
                console.error("Id user of qr is undefined");
            }
        };
        deleteFromMeals()
    }


    let basalMetabolicRate = userData.length > 0 ? BasalMetabolicRate(
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
// console.log('length', resultCaloriesCustom?.length)
// console.log('value: ', resultCaloriesCustom)
// const [foodsQrBySelectedDate, setFoodsQrBySelectedDate] = useState<FoodItemQr[]>([]);
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
            if (resultCaloriesCustom.length > 0 && userData[0]?.id && selectedDate) {
                const totalKcalCustom = resultCaloriesCustom.reduce((acc: number, item: FoodItem) => {
                    const baseCalories = item.calories || 0;
                    const quantity = parseFloat(item.quantityCustom);
                    
                    return Math.round(acc + (baseCalories * quantity / 100));
                }, 0);
                totalKcal += totalKcalCustom;
            }
            if (allFoodQrcode.length > 0 && userData[0]?.id && selectedDate) {
                const mealsForSelectedDateQr = allFoodQrcode.filter(item =>
                    item.date === selectedDate.toLocaleDateString()
                );

                const totalKcalQr = mealsForSelectedDateQr.reduce((acc: number, item: FoodItemQr) => {
                    return acc + (item.calories || 0);
                }, 0);
                totalKcal += Number(totalKcalQr);
            }

        setTotalKcalConsumeToday(totalKcal);
    }, [allFoodDataCreated, resultAllDataFood, selectedDate, foodsForSelectedDate, allFoodQrcode, userData, resultCaloriesCustom]);

    console.log('foodsQrBySelectedDate', foodsQrBySelectedDate)
    useEffect(() => {
        getTotalNutrient(resultAllDataFood, 'magnesium', setMagnesium, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'potassium', setPotassium, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'calcium', setCalcium, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'sodium', setSodium, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'iron', setIron, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminA', setVitaminA, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminB1', setVitaminB1, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminB5', setVitaminB5, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminB6', setVitaminB6, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminB12', setVitaminB12, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminC', setVitaminC, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminD', setVitaminD, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminE', setVitaminE, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'vitaminK', setVitaminK, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'folate', setFolate, foodsForSelectedDate, resultCaloriesCustom)
        getTotalNutrient(resultAllDataFood, 'sugar', setSugar, foodsForSelectedDate, resultCaloriesCustom, foodsQrBySelectedDate)
        getTotalNutrient(resultAllDataFood, 'proteins', setProteins, foodsForSelectedDate, resultCaloriesCustom, foodsQrBySelectedDate)
        getTotalNutrient(resultAllDataFood, 'carbohydrates', setCarbs, foodsForSelectedDate, resultCaloriesCustom, foodsQrBySelectedDate)
        getTotalNutrient(resultAllDataFood, 'fats', setFats, foodsForSelectedDate, resultCaloriesCustom, foodsQrBySelectedDate)
    }, [resultAllDataFood, foodsForSelectedDate, resultCaloriesCustom, foodsQrBySelectedDate]);

    const nutritionData = [
        { name: t('potassium'), quantity: potassium, unit: 'g' },
        { name: t('magnesium'), quantity: magnesium, unit: 'g' },
        { name: t('calcium'), quantity: calcium, unit: 'g' },
        { name: t('sodium'), quantity: sodium, unit: 'g' },
        { name: t('vitaminA'), quantity: vitaminA, unit: '%' },
        { name: t('vitaminB1'), quantity: vitaminB1, unit: '%' },
        { name: t('vitaminB5'), quantity: vitaminB5, unit: '%' },
        { name: t('vitaminB6'), quantity: vitaminB6, unit: '%' },
        { name: t('vitaminB12'), quantity: vitaminB12, unit: '%' },
        { name: t('vitaminC'), quantity: vitaminC, unit: '%' },
        { name: t('vitaminD'), quantity: vitaminD, unit: '%' },
        { name: t('vitaminE'), quantity: vitaminE, unit: '%' },
        { name: t('vitaminK'), quantity: vitaminK, unit: '%' },
        { name: t('folate'), quantity: folate, unit: 'g' },
        { name: t('iron'), quantity: iron, unit: 'g' },
        // { name: 'Fiber', quantity: 0, unit: 'g' },
        { name: t('sugar'), quantity: sugar, unit: 'g' },
    ];

    const proteinsGoal = calculProteins(Number(userData[0]?.weight)) || 0;
    const totalCaloriesGoal = basalMetabolicRate.toLocaleString('en-US')

    let goal = basalMetabolicRate - totalKcalConsumeToday;
    if (goal < 0) {
        goal = 0
    }

    let logCalories = userData[0]?.goalLogs["calories"] ?? 0;
    if (userData[0]?.goal === 'lose') {
        basalMetabolicRate -= logCalories; // on retire
        goal -= logCalories; // on retire
    } else if (userData[0]?.goal === 'gain') {
        basalMetabolicRate += logCalories; // on ajoute
        goal += logCalories; // on ajoute
    }

    const dispatch = useDispatch()
    const handleXPUpdate = async () => {

        // Checks if XP can be added based on calories consumed
        if (totalKcalConsumeToday >= basalMetabolicRate && selectedDate.toLocaleDateString() === date.toLocaleDateString()) {
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

                        const updatedUserDoc = doc(firestore, "User", userData[0]?.id);
                        const updatedUserSnapshot = await getDoc(updatedUserDoc);
                        const updatedUserData = updatedUserSnapshot.data();
    
                        // console.log('first xp', userData[0].xp)
                        // Met à jour Redux
                        if (updatedUserData) {
                            dispatch(updateUserXp({
                                xp: updatedUserData.xp,
                                level: updatedUserData.level,
                            }));
                        }
                        console.log("Dispatch de l'action Redux avec :", {
                            xp: updatedUserData?.xp,
                            level: updatedUserData?.level,
                        });

                        setTimeout(() => {
                            setNotificationVisible(false)
                        }, 3200);
                    } else {
                        console.log("The maximum XP of 20 is already reached today");
                    }
                }
            } catch (error) {
                console.error("Error when adding XP :", error);
            }
        } else {
            console.log("No gain XP", totalKcalConsumeToday + "/" + basalMetabolicRate);
        }
    };

    async function handleTotalKcalConsumeToday() {
        const today = selectedDate.toLocaleDateString('fr-CA');
        const userId = userData[0].id;
        if (!userId) {
            console.error("User ID is undefined");
            return;
        }
        
        try {
            const userDocRef = doc(firestore, "User", userId);
            
            await updateDoc(userDocRef, {
                [`consumeByDays.${today}`]: totalKcalConsumeToday,
            });

            // console.log("Dispatching update with data:", today, totalKcalConsumeToday);
            dispatch(updateUserCaloriesByDay({
                consumeByDays: {
                    [today]: totalKcalConsumeToday, // Add new data for today
                }
            }))
            // console.log("Data successfully sent to Firestore");
            // console.log("Dispatch finished for today:", today, totalKcalConsumeToday);
            // console.log("Data successfully sent to Firestore");
        } catch (err) {
            console.error("Error posting totalKcalConsumeToday:", err);
        }
    }
    // Surveillance de l'état de la consommation de calories et du métabolisme de base
    useEffect(() => {
        // Exécuter la fonction handleXPUpdate dès que ces valeurs sont disponibles
        if (totalKcalConsumeToday > 0 && basalMetabolicRate > 0) {
            handleXPUpdate();
        }
        const fetch = async () => {
            await handleTotalKcalConsumeToday()
            console.log('Update')
        }
        fetch()
    }, [totalKcalConsumeToday, basalMetabolicRate, selectedDate]); 
    
    async function handleMacronutrients() {

        const today = selectedDate.toLocaleDateString('fr-CA');
        const userId = userData[0].id;
        if (!userId) {
            console.error("User ID is undefined");
            return;
        }

        try {
            const userDocRef = doc(firestore, "User", userId);
            
            await updateDoc(userDocRef, {
                [`proteinsTotal.${today}`]: proteins,
                [`carbsTotal.${today}`]: carbs,
                [`fatsTotal.${today}`]: fats,
            });
            dispatch(updateMacronutrients({proteinsTotal: {[today]: proteins}, carbsTotal: {[today]: carbs}, fatsTotal: {[today] : fats}}))
        } catch (err) {
            console.error("Error posting total proteins carbs fatd:", err);
        }
    }

    useEffect(() => {
        if (proteins && carbs && fats) {
            const fetch = async () => {
            await handleMacronutrients();
        };
        fetch();
        }
    }, [proteins, carbs, fats])
    return (
        <>
            <View style={{width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.grayMode}}>
                <TouchableOpacity onPress={handleOpenCalendar}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, height: '100%', width: '40%'}}>
                        <ThemedText variant="title1" color={colors.black} style={{height: '100%', textAlignVertical: 'center', textAlign: 'center'}}>{selectedDate.toLocaleDateString() === date.toLocaleDateString() ?
                            t('today'):
                            `${capitalizeFirstLetter(selectedDate.toLocaleString('default', { month: 'short' }))} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`}
                        </ThemedText>
                        {theme === "light" ?
                            <Image source={require('@/assets/images/chevron-bas.png')} style={{width: 20, height: 20}}/>
                            :
                            <Image source={require('@/assets/images/chevronWhite.png')} style={{width: 20, height: 20}}/>
                            }
                    </View>
                </TouchableOpacity>
            {notificationVisible && (
                <View style={styles.notification}>
                    <View style={styles.wrapperNotification}>
                        <Text style={styles.notificationText}>{t('msg_exp')}</Text>
                    </View>
                    <LottieView
                    source={require('@/assets/lottie/Confetti.json')}
                    loop={true}
                    style={{ width: 400, height: 400, position: 'absolute' }}
                    autoPlay={true}
                    />
                </View>
            )}
            </View>
            <ScrollView style={[styles.header, {paddingTop: 10, backgroundColor: colors.whiteMode}]}>
            <View style={[styles.card, { backgroundColor: colors.white, shadowColor: colors.shadow }]}>
                {isOpen && (
                    <RNDateTimePicker
                    onChange={setDate}
                    value={selectedDate}
                    timeZoneOffsetInMinutes={0}
                    mode="date"
                    display="default"
                    style={{ width: '100%' }}
                    />
                )}

                {!isLoading ? (
                    <>
                    <View style={styles.headerRow}>
                        <Text style={[styles.caloriesText, { color: colors.black }]}>
                        {showIcon && '🎯'} {Math.round(basalMetabolicRate)} <Text style={styles.unit}>kcal</Text>
                        </Text>
                        <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.badgeText, { color: colors.black }]}>
                            {goal.toFixed(0)} {t('left')}
                        </Text>
                        </View>
                    </View>
                    <Text style={[styles.progressText, { color: colors.black }]}>
                        {Math.round(totalKcalConsumeToday)} / {Math.round(basalMetabolicRate)} 
                    </Text>
                        <ProgressBarKcal isLoading={!isLoading} progress={totalKcalConsumeToday} nutri={'Kcal'} quantityGoal={basalMetabolicRate}/>
                    </>
                ) : (
                    <>
                    <View style={{marginBottom: 5}}><Skeleton width={280} height={40} colorMode={colorMode} /></View>
                    <View style={{marginBottom: 5}}><Skeleton width={100} height={24} colorMode={colorMode} /></View>
                    <View><Skeleton width={280} height={20} colorMode={colorMode} /></View>
                    </>
                )}
                </View>
                <ProgressRing isLoading={!isLoading} progressProteins={Number(proteins.toFixed(1))} proteinsGoal={proteinsGoal} progressCarbs={Number(carbs.toFixed(1))} carbsGoal={calculCarbohydrates(basalMetabolicRate)} progressFats={Number(fats.toFixed(1))} fatsGoal={calculFats(basalMetabolicRate)} goal={userData[0]?.goal} goalProteins={userData[0]?.goalLogs['proteins']} goalCarbs={userData[0]?.goalLogs['carbs']} goalFats={userData[0]?.goalLogs['fats']}/>
                
                <View style={styles.wrapperMeals}>
                    {DisplayResultFoodByMeal(sortByBreakfast,resultBreakfastCreated, sortByBreakfastCustom, resultBreakfastQr, t('breakfast'), handleDeleteFood, handleDeleteFoodCreated, handleDeleteFoodCustom, handleDeleteFoodQr, !isLoading || false )}
                    {DisplayResultFoodByMeal(sortByLunch, resultLunchCreated, sortByLunchCustom,resultLunchQr, t('lunch'), handleDeleteFood, handleDeleteFoodCreated, handleDeleteFoodCustom, handleDeleteFoodQr, !isLoading || false)}
                    {DisplayResultFoodByMeal(sortByDinner, resultDinnerCreated, sortByDinnerCustom, resultDinnerQr, t('dinner'), handleDeleteFood, handleDeleteFoodCreated, handleDeleteFoodCustom,handleDeleteFoodQr, !isLoading || false)}
                    {DisplayResultFoodByMeal(sortBySnack,resultSnackCreated, sortBySnackCustom, resultSnackQr, t('snack'), handleDeleteFood, handleDeleteFoodCreated, handleDeleteFoodCustom, handleDeleteFoodQr, !isLoading || false)}
                </View>
                
                <View style={{marginBottom: 60}}>
                    <NutritionList data={nutritionData} isPremium={isPremium}/>
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
        marginBottom: 30
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
        bottom: 30,
        width: "100%",
        alignItems: "center",
        zIndex: 999,
        backgroundColor: 'red'
    },
    wrapperNotification : {
        position: 'absolute',
        zIndex: 3,
        top: 650,
        left: '20%',
        right: '20%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'white',
        width: '60%',
        height: 70,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    notificationText: {
        color: "#333",
        fontWeight: "600",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        textAlign: "center",
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 25,
        shadowOpacity: 0.12,
        shadowRadius: 15,
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
    },
    headerRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    caloriesText: {
        fontSize: 40,
        fontWeight: '900',
        fontFamily: 'Oswald',
    },
    unit: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 30,
        alignSelf: 'flex-start',
        width: '100%'
    },
    badgeText: {
        fontWeight: '700',
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        flexShrink: 1, 
        maxWidth: "100%",  
    },
    progressBarBackground: {
        height: 12,
        borderRadius: 20,
        backgroundColor: '#E6E6E6',
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 20,
    },
    progressText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
})
