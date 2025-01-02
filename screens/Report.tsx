
import { firestore } from "@/firebaseConfig";
import { fetchUserDataConnected } from "@/functions/function";
import { useTheme } from "@/hooks/ThemeProvider";
import { getAuth, User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';

const ReportIssue = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [date] = useState(new Date().toLocaleString());
    const [isModalVisible, setModalVisible] = useState(false)
    const { colors } = useTheme()

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        try {
            const fetchData = async () => {
            fetchUserDataConnected(user, setUserData)
        }
        fetchData()
        }catch (e) {
            console.log('Error processing data', e);
        }
    }, []);

    const categories = [
        { label: 'Report a problem', value: 'issue' },
        { label: 'Possible improvement', value: 'improvement' },
        { label: 'General feedback', value: 'feedback' },
    ];

    const sendReport = async ()  => {
        const title = `Report: ${category ? category : 'General Feedback'} - ${date}`;
        const reportContent = `${message}`;
        if(message.length > 2300) {
            Alert.alert('Your message is too long')
            return
        }
        try {
            await addDoc(collection(firestore, "MessageReport"), {
                title: title,
                email: userData[0]?.email,
                message: reportContent,
                date: date,
                category: category ? category : 'General Feedback',
            });
    
            Alert.alert('Report successfully saved');
        } catch (error) {
            console.error('Error saving report: ', error);
            Alert.alert('Error saving report');
        }

    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Report an Issue</Text>

        <Text style={styles.label}>Enter Category</Text>
        <TextInput
                style={styles.textInput}
                placeholder="Select a category"
                value={category}
                onFocus={() => setModalVisible(true)} // Show modal when focused
            />

            {/* Modal for selecting category */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Category</Text>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.value}
                                style={styles.modalButton}
                                onPress={() => {
                                    setCategory(cat.label);
                                    setModalVisible(false); // Close modal after selection
                                }}
                            >
                                <Text style={styles.modalButtonText}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

        {/* <TextInput
            style={styles.textInput}
            placeholder="Enter the category (e.g., Problem, Improvement)"
            value={category}
            onChangeText={setCategory}
        /> */}

        <Text style={styles.label}>Your Message</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Describe your issue or feedback..."
            value={message}
            onChangeText={setMessage}
            multiline
        />
        <Text>* Max 2300 caracters</Text>

        <Text style={[styles.label]}>Date: {date}</Text>

        <Button title="Send Report" color={colors.primary} onPress={sendReport} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        marginTop: 5,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    modalButtonText: {
        fontSize: 16,
    },
});

export default ReportIssue;