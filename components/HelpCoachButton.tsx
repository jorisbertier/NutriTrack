import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HelpCoachButton = () => {
    const [visible, setVisible] = useState(false);

    return (
        <>
        {/* Bouton ? */}
        <TouchableOpacity style={styles.helpButton} onPress={() => setVisible(true)}>
            <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>

        {/* Modale explicative */}
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Ton Coach 👨‍🏫</Text>
                <Text style={styles.description}>
                Ton coach analyse chaque jour ton alimentation, tes calories, macronutriments et ton
                activité.  
                Il te donne des conseils personnalisés pour rester motivé et atteindre
                ton objectif (prise de masse, perte de poids ou maintien).
                Ton coach change d'humeur en fonction de ce que tu manges : il peut être motivé, heureux, triste ou en colère selon tes apports !
                </Text>

                <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
                <Text style={styles.closeText}>J’ai compris 🚀</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    helpButton: {
        position: "absolute",
        top: 45, // ajuste selon status bar
        left: 20,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#9671ff",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
    helpText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        width: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    description: {
        fontSize: 15,
        color: "#555",
        marginBottom: 20,
        lineHeight: 22,
    },
    closeButton: {
        backgroundColor: "#77c6ff",
        paddingVertical: 10,
        borderRadius: 10,
    },
    closeText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default HelpCoachButton;
