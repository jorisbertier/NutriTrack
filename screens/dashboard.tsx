import Row from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Text } from "react-native";
import RNDateTimePicker, { DateTimePickerEvent} from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from '@/interface/FoodItem';
import { UserMeals } from "@/interface/UserMeals";
import { Users } from "@/data/users";
import { UsersFoodData } from "@/data/usersFoodData";
import CardFoodResume from "@/components/Screens/Dashboard/CardFoodResume";
import { getAuth } from "firebase/auth";
import { fetchUserDataConnected } from "@/functions/function";
import { firestore } from "@/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function Dashboard() {

    const [userIdConnected, setUserIdConnected] = useState<number>();
    const auth = getAuth();
    const user = auth.currentUser;

    const [allFoodData, setAllFoodData] = useState<FoodItem[]>([]);  // all foods
    const [allUserData, setAllUserData] = useState([]);  // all user
    const [allUsersFoodData, setAllUsersFoodData] = useState<UserMeals[]>([]);  // all UsersFoodData
    const [resultAllDataFood, setResultAllDataFood] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByBreakfast, setSortByBreakfast] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByLunch, setSortByLunch] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortByDinner, setSortByDinner] = useState<FoodItem[]>([]); //State for stock search filtered
    const [sortBySnack, setSortBySnack] = useState<FoodItem[]>([]); //State for stock search filtered
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate]= useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState<any>(0)
    /* Date */
    const date = new Date();

    const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
        if(date) {
            setSelectedDate(date);
            setIsOpen(false)
            // console.log(event)
        }
    };
    // console.log(foodData)
    /* API */
    useEffect(() => {
        try {
            const fetchData = async () => {
                /** TEST */
                const userMealsCollection = collection(firestore, 'UserMeals');
                const userMealsSnapshot = await getDocs(userMealsCollection);
                const userMealsList = userMealsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    foodId: doc.data().foodId as number,
                    userId: doc.data().userId as number,
                    mealType: doc.data().mealType as string,
                    date: doc.data().date as string,
                }));
                console.log(userMealsList)
                setAllUsersFoodData(userMealsList)
                /** TEST */
            }
            fetchData()
            setAllFoodData(foodData);
            setAllUserData(Users);
            // setAllUsersFoodData(UsersFoodData)
            fetchUserDataConnected(user, setUserIdConnected)
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
            // if (result.length > 0) {
            //     const foodIds = result.map(item => item.foodId); //// the result to extract all the food IDs
            //     const filteredFoodData = foodIds.flatMap(foodId => { // For each foodId get details food data from allFoodData
            //         return allFoodData.filter(food => food.id === foodId);
            //     });
            //     setResultAllDataFood(filteredFoodData); // Update state with filtered data search
            // } else {
            //     setResultAllDataFood([])
            // }
            filterAndSetFoodData(result, setResultAllDataFood)
            filterAndSetFoodData(resultByBreakfast, setSortByBreakfast)
            filterAndSetFoodData(resultByLunch, setSortByLunch)
            filterAndSetFoodData(resultByDinner, setSortByDinner)
            filterAndSetFoodData(resultBySnack, setSortBySnack)
        }
        console.log(update)
    }, [selectedDate,allUsersFoodData, userIdConnected]);
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

    return (
        <ScrollView style={styles.header}>
            <ThemedText>Voici ma page dashboard</ThemedText>
            <Row style={styles.wrapperCalendar}>
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
                            <ThemedText>{selectedDate.toLocaleDateString()}</ThemedText>
                    </View>
                </TouchableOpacity>
                <View>
                    <Image source={require('@/assets/images/navbar/home.png')} style={styles.next} />
                </View>
            </Row>
            <Row>
            {/* { resultAllDataFood.length !== 0 ? (
                <FlatList<FoodItem>
                    data={resultAllDataFood}
                    renderItem={({ item }) => (
                        <ThemedText>{item.name}</ThemedText>
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString() + Math.random()}
                    // contentContainerStyle={styles.foodData}
                />
            ) : (
                <ThemedText>Vous n'avez aucun aliment aujourd'hui</ThemedText>
            )} */}
            </Row>
            <View>
                <Text>#{userIdConnected}</Text>
            </View>
            {isLoading ? <ThemedText>Chargement...</ThemedText> :(
            <View style={styles.wrapperMeals}>
                    {displayResultFoodByMeal(sortByBreakfast, 'Breakfast', handleDeleteFood)}
                    {displayResultFoodByMeal(sortByLunch, 'Lunch', handleDeleteFood)}
                    {displayResultFoodByMeal(sortByDinner, 'Dinner', handleDeleteFood)}
                    {displayResultFoodByMeal(sortBySnack, 'Snack', handleDeleteFood)}
            </View>
            )}
        </ScrollView>
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
        backgroundColor: 'yellow'
    },
    wrapperMeals : {
        gap: 16,
        flexDirection: 'column',
        width: '100%',
    },
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


function displayResultFoodByMeal(resultMeal: any, meal: string,handleDeleteFood: (userMealId: string) => void) {

    return (
        <View style={styles.wrapper}>
            <Row style={styles.row}>
                <ThemedText variant="title">{meal}</ThemedText>
                <ThemedText>0 Kcal</ThemedText>
            </Row>
            <Row>
            { resultMeal.length !== 0 ? (
                <FlatList<FoodItem>
                    data={resultMeal}
                    renderItem={({ item }) => (
                        // <ThemedText>{item.name}</ThemedText>
                        <CardFoodResume
                        name={item.name}
                        quantity={item.nutrition.servingSize.quantity}
                        unit={item.nutrition.servingSize.unit}
                        image={item.image}
                        id={item.id}
                        userMealId={item.userMealId}
                        calories={item.nutrition.calories}
                        handleDelete={()=> handleDeleteFood(item.userMealId)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id.toString()}
                />
                ) : (
                    <ThemedText>Don't have any food for {meal}</ThemedText>
            )}
            </Row>
        </View>
    )
}