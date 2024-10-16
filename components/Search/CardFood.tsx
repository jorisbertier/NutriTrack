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

type Props = {
    id: number;
    name: string;
    calories: string;
    unit: string;
    quantity: number;
};

type UserConnected = {
    index: number;
    id: string;
    email: string;
} | null;

const CardFood: React.FC<Props> = ({ name, id, calories, unit, quantity }) => {
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const addImageRef = useRef(null);
    const [userIdConnected, setUserIdConnected] = useState<number>();

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

        // Vérifie si l'élément est près du bas de l'écran
        if (pageY > screenHeight - 200) { // Ajuste la valeur si nécessaire
            setModalPosition({ top: pageY - 250, left: event.nativeEvent.pageX - 60 }); // Ouvre vers le haut
        } else {
            setModalPosition({ top: pageY -17, left: event.nativeEvent.pageX - 60 }); // Ouvre vers le bas
        }

        setModalVisible(true);
    };

    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };
    // const generateUniqueId = () => crypto.randomUUID();

    const handleValue = (valueMeal: string, idFood: number) =>{
        // console.log(valueMeal)
        // console.log('Id food:',idFood)
        try {
            const date = new Date();
            // console.log(date.toLocaleDateString())
            // console.log(userIdConnected)
            // console.log('test')
            const newId = generateUniqueId()
            console.log(typeof newId)
    
            const addAliment = async() => {
                await setDoc(doc(firestore, "UserMeals", newId), {
                    foodId: idFood,
                    userId: userIdConnected,
                    date: date.toLocaleDateString(),
                    mealType: valueMeal,
                });
            }
            addAliment()
            console.log("Document successfully written with ID: ", newId)
        } catch(e) {
            console.log('Error add aliment to database UserMeals', e)
        }
    }

    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={styles.cardFood}>
                <View style={styles.text}>
                    <ThemedText variant="title1">{capitalizeFirstLetter(name)}</ThemedText>
                    <ThemedText variant="title2" color="grayDark">
                        {calories} cal, {name} {quantity} {unit}
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
                        <Text style={styles.modalText}>{name}</Text>
                        {meals.map((meal, index) => (
                            <Text key={`${index}-${meal}`} onPress={() => handleValue(meal, id)}>{meal}</Text>
                        ))}
                        {/* <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable> */}
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
        backgroundColor: "#F5F5F5",
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
        padding: 20,
        gap: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
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
    }
});

export default CardFood; // Vérifie que tu as exporté ton composant ici
