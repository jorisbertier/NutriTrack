import React, { useState, useRef, useContext } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Text, Dimensions, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter, fetchUserDataConnected } from "@/functions/function";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { firestore } from "@/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useTheme } from "@/hooks/ThemeProvider";
import { FoodContext } from "@/hooks/FoodContext";
import { FoodItemCreated } from "@/interface/FoodItemCreated";
import { User } from "@/interface/User";
import { useNavigation } from "expo-router";

type Props = {
    id: number;
    idDoc: any;
    name: string;
    calories: number;
    unit: string;
    quantity: number;
    selectedDate: string,
    setNotification: any
};


const CardFoodCreated: React.FC<Props> = ({ idDoc, name, id, calories, unit, quantity, selectedDate , setNotification}) => {

    const {colors} = useTheme();
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [userData, setUserData] = useState<User[]>([])
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const { allDataFoodCreated, setAllDataFoodCreated } = useContext(FoodContext);
    
    const addImageRef = useRef(null);
    const auth = getAuth();
    const user = auth.currentUser;

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
    
    const navigateToDetails = () => {
        navigation.navigate("FoodDetailsCreated", { id });
    };

    const handlePress = (event: any) => {
        const { pageY } = event.nativeEvent;
        const screenHeight = Dimensions.get('window').height;

        // Verify is element es near of bottom at the screen
        if (pageY > screenHeight - 200) {
            setModalPosition({ top: pageY - 250, left: event.nativeEvent.pageX - 60 }); // Open to the top
        } else {
            setModalPosition({ top: pageY -17, left: event.nativeEvent.pageX - 60 }); //Open to the bottom
        }

        setModalVisible(true);
    };

    
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const handleValue = (valueMeal: string, idFood: number) =>{
        try {
            const newId = generateUniqueId()
            
            const addAliment = async() => {
                await setDoc(doc(firestore, "UserMealsCreated", newId), {
                    foodId: idDoc,
                    userId: userData[0]?.id,
                    date: selectedDate,
                    mealType: valueMeal,
                });
            }
            addAliment()
            setModalVisible(false)
            setNotification(true)

            setTimeout(() => {
                setNotification(false)
            }, 1500);

            console.log("Document successfully written with ID: ", newId)
        } catch(e) {
            console.log('Error add aliment to database UserMeals', e)
        }
    }

    const handleDelete = (id: any) => {
        if (!id) {
            console.error("Meal user ID is undefined.");
            return;
        }

        Alert.alert(
            "Confirmation",
            "This action is irreversible and may affect the data in your dashboard if this food item is present !\n\n\Are you sure you want to eliminate this food? ",

            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion canceled"),
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const mealDocRef = doc(firestore, "UserCreatedFoods", idDoc);
                            await deleteDoc(mealDocRef);

                            const mealsCollectionRef = collection(firestore, "UserMealsCreated");
                            const querySnapshot = await getDocs(mealsCollectionRef);
                            const relatedDocs = querySnapshot.docs.filter(
                                doc => doc.data().foodId === idDoc
                            ); 
    
                            const deletePromises = relatedDocs.map(doc => deleteDoc(doc.ref));
                            await Promise.all(deletePromises);
    
                            setAllDataFoodCreated((prevData: FoodItemCreated[]) =>
                                prevData.filter(food => food.idDoc !== idDoc)
                            );
    
                            console.log("Document deleted with success");
                        } catch (error) {
                            console.error("Error during deletion of document: ", error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false } 
        );
    };

    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={[styles.cardFood, {backgroundColor: colors.grayMode}]}>
                <View style={styles.text}>
                    <ThemedText variant="title1" color={colors.black}>{capitalizeFirstLetter(name)}</ThemedText>
                    <ThemedText variant="title2" color="grayDark">
                        {calories} kcal,{name} {quantity} {unit}
                    </ThemedText>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', width: '30%', height: '100%', gap: 10}}>
                    <Pressable ref={addImageRef} onPress={handlePress} style={styles.wrapperAdd}>
                        <Image source={require("@/assets/images/add.png")} style={styles.add} />
                    </Pressable>
                    <Pressable style={[styles.wrapperAdd, {width: 50}]} onPress={() => handleDelete(id)}>
                        <Image source={require("@/assets/images/delete.png")} style={[styles.delete, {tintColor: colors.black}]}/>
                    </Pressable>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
                    <View style={[styles.modalView, { top: modalPosition.top + 7, left: modalPosition.left - 100 }]}>
                        {meals.map((meal, index) => (
                            <Pressable 
                                style={({ pressed }) => [
                                    styles.blocMeal, 
                                    {
                                        backgroundColor: pressed ? `${colors.grayPress}` : 'transparent' ,
                                        borderTopEndRadius: index === 0 ? 20 : 0,
                                        borderTopStartRadius: index === 0 ? 20 : 0,
                                        borderBottomEndRadius: index === 3 ? 20 : 0,
                                        borderBottomStartRadius: index === 3 ? 20 : 0,
                                        borderBottomWidth: index === 3 ? 0 :1,
                                        borderBlockColor: `${colors.grayPress}`}
                                ]}
                                key={`${index}-${meal}-${Math.random()}`} 
                                onPress={() => handleValue(meal, id)}
                            >
                                <Text style={styles.textMeal}>{meal}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Modal>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardFood: {
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 80,
        borderRadius: 15,
        width: "100%",
    },
    add: {
        width: 35,
        height: 35,
    },
    text: {
        gap: 5,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 20,
        gap: 0,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    wrapperAdd: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blocMeal : {
        width: '100%',
        padding: 10,
        paddingLeft: 25
    },
    textMeal : {
        fontSize: 16,
        fontWeight: '400'
    },
    delete : {
        width: 20,
        height: 20
    }
});

export default CardFoodCreated;
