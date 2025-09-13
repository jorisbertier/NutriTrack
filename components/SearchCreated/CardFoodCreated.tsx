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
import { useTranslation } from "react-i18next";
import AnimatedToast from "../AnimatedToastProps";
import LottieView from "lottie-react-native";

type Props = {
    id: number;
    idDoc: any;
    name: string;
    calories: number;
    unit: string;
    quantity: number;
    image?: string;
    selectedDate: string,
    setNotification: any,
    notification: boolean
};


const CardFoodCreated: React.FC<Props> = ({ idDoc, name, id, calories, unit, quantity, image, selectedDate , setNotification, notification}) => {

    const {colors, theme} = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [activeAddId, setActiveAddId] = useState<number | null>(null);
    
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [userData, setUserData] = useState<User[]>([])
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const { allDataFoodCreated, setAllDataFoodCreated } = useContext(FoodContext);
    
    const addImageRef = useRef(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
    };

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
            setActiveAddId(idFood);

            setTimeout(() => {
                setNotification(false)
                setActiveAddId(null)
            }, 2400);

            console.log("Document successfully written with ID: ", newId)
        } catch(e) {
            // console.log('Error add aliment to database UserMeals', e)
            showFeedback('error', t('error_food_created'));
        }
    }

    const handleDelete = (docId: string) => {
    if (!docId) {
        showFeedback('error', t('error_meal'));
        return;
    }

    Alert.alert(
        t('confirmation'),
        t('deleteFoodWarning'),
        [
        { text: t('cancel'), style: 'cancel' },
        {
            text: t('delete'),
            style: 'destructive',
            onPress: async () => {
            try {
                // 1) Supprimer le doc principal
                await deleteDoc(doc(firestore, "UserCreatedFoods", docId));

                // 2) Supprimer les meals liés (foodId stocke **docId** chez toi)
                const mealsSnap = await getDocs(collection(firestore, "UserMealsCreated"));
                const related = mealsSnap.docs.filter(d => d.data().foodId === docId);
                await Promise.all(related.map(d => deleteDoc(d.ref)));

                // 3) MAJ état local
                setAllDataFoodCreated(prev => prev.filter(f => f.idDoc !== docId));

                showFeedback('success', t('foodDeleted'));
            } catch (e) {
                console.log(e);
                showFeedback('error', t('error_food_deleted'));
            }
            }
        }
        ],
        { cancelable: false }
    );
    };


    return (
        <TouchableOpacity onPress={navigateToDetails} disabled={notification}>

            <View style={[styles.cardFood, {backgroundColor: colors.grayMode}]}>
                <View style={{width: 40, height: 40,borderRadius: 20,overflow: "hidden", marginRight: 10}}>
                    <Image
                        source={
                            image
                            ? { uri: image }
                            : require("@/assets/images/default/fooddefault.jpg")
                        }
                        resizeMode="cover"
                        style={{width: "100%", height: "100%"}}
                    />
                </View>

                <View style={{flex: 1, justifyContent: "center", marginLeft: 10}}>
                    <ThemedText variant="title1" color={colors.black}>
                        {capitalizeFirstLetter(name.length > 10 ? name.slice(0, 8) + ".." : name)}
                    </ThemedText>
                    <ThemedText variant="title2" color="grayDark">
                        {calories} kcal, {name.length > 10 ? name.slice(0, 8) + ".." : name}, {quantity} {unit}
                    </ThemedText>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', width: '30%', height: '100%', gap: 10}}>
                        {(!notification || activeAddId !== id) ? (
                                        <Pressable ref={addImageRef} onPress={handlePress} disabled={notification} style={styles.wrapperAdd}>
                                            <Image source={require("@/assets/images/add.png")} style={[styles.add, { tintColor: colors.black, opacity: 0.9}]} />
                                        </Pressable>
                                    ) : (
                                        <View style={styles.wrapperAdd}>
                                        {theme === "light" ? (
                                            <LottieView
                                            source={require('@/assets/lottie/Black Check.json')}
                                            loop={false}
                                            style={{ width: 50, height: 50 }}
                                            autoPlay
                                            />
                                        ): (
                                            <LottieView
                                            source={require('@/assets/lottie/White Check.json')}
                                            loop={false}
                                            style={{ width: 50, height: 50 }}
                                            autoPlay
                                            />

                                        )}
                                                            </View>
                                                        )}
                    <Pressable style={[styles.wrapperAdd, {width: 50}]} onPress={() => handleDelete(idDoc)} disabled={notification}>
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
            {feedback && (
                <AnimatedToast
                    message={feedback.message}
                    type={feedback.type}
                    onHide={() => setFeedback(null)}
                    height={0}
                />
            )}
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
        textAlign: "left"
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
