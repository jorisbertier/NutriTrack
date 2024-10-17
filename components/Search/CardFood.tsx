import React, { useState, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Text, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { fetchUserDataConnected2, fetchUserDataConnected } from "@/functions/function";
import { getAuth } from "firebase/auth";
import { firestore } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import useThemeColors from "@/hooks/useThemeColor";

type Props = {
    id: number;
    name: string;
    calories: string;
    unit: string;
    quantity: number;
    selectedDate: string
};

type UserConnected = {
    index: number;
    id: string;
    email: string;
} | null;

const CardFood: React.FC<Props> = ({ name, id, calories, unit, quantity, selectedDate }) => {

    const colors = useThemeColors();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [userIdConnected, setUserIdConnected] = useState<number>();
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    
    const navigation = useNavigation<any>(); 
    const addImageRef = useRef(null);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserDataConnected(user, setUserIdConnected)
            }
            fetch()
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, [user]);
    

    const navigateToDetails = () => {
        navigation.navigate("FoodDetails", { id });
    };

    const handlePress = (event) => {
        const { pageY } = event.nativeEvent;
        const screenHeight = Dimensions.get('window').height;
        console.log(screenHeight)

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
            const date = new Date();
            const newId = generateUniqueId()
            console.log(typeof newId)
            console.log("ici")
            console.log(selectedDate)
    
            const addAliment = async() => {
                await setDoc(doc(firestore, "UserMeals", newId), {
                    foodId: idFood,
                    userId: userIdConnected,
                    date: selectedDate,
                    mealType: valueMeal,
                });
            }
            addAliment()
            setModalVisible(false)
            console.log("Document successfully written with ID: ", newId)
        } catch(e) {
            console.log('Error add aliment to database UserMeals', e)
        }
    }

    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={[styles.cardFood, {backgroundColor: colors.gray}]}>
                <View style={styles.text}>
                    <ThemedText variant="title1">{capitalizeFirstLetter(name)}</ThemedText>
                    <ThemedText variant="title2" color="grayDark">
                        {calories} kcal, {name} {quantity} {unit}
                    </ThemedText>
                </View>
                <Pressable ref={addImageRef} onPress={handlePress} style={styles.wrapperAdd}>
                    <Image source={require("@/assets/images/add.png")} style={styles.add} />
                </Pressable>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />
                    <View style={[styles.modalView, { top: modalPosition.top + 7, left: modalPosition.left - 100 }]}>
                        {/* <Text style={styles.modalText}>{name}</Text> */}
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
        width: '20%',
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
    }
});

export default CardFood;