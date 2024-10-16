import React, { useState, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Text, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { capitalizeFirstLetter } from "@/functions/function";
import { useNavigation } from "expo-router";

type Props = {
    id: number;
    name: string;
    calories: string;
    unit: string;
    quantity: number;
};

const CardFood: React.FC<Props> = ({ name, id, calories, unit, quantity }) => {
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const addImageRef = useRef(null);

    const navigateToDetails = () => {
        navigation.navigate("FoodDetails", { id });
    };

    const handleOpenModal = () => {
        addImageRef.current.measure((fx, fy, width, height, px, py) => {
            setModalPosition({ top: py, left: px });
            setModalVisible(true);
        });
    };

    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={styles.cardFood}>
                <View style={styles.text}>
                    <ThemedText variant="title1">{capitalizeFirstLetter(name)}</ThemedText>
                    <ThemedText variant="title2" color="grayDark">
                        {calories} cal, {name} {quantity} {unit}
                    </ThemedText>
                </View>
                <Pressable ref={addImageRef} onPress={handleOpenModal}>
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
                        <Text style={styles.modalText}>Breakfast</Text>
                        <Text style={styles.modalText}>Lunch</Text>
                        <Text style={styles.modalText}>Dinner</Text>
                        <Text style={styles.modalText}>Snack</Text>
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
});

export default CardFood; // Vérifie que tu as exporté ton composant ici
