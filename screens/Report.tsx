
import { firestore } from "@/firebaseConfig";
import { useTheme } from "@/hooks/ThemeProvider";
import { RootState } from "@/redux/store";
import { fetchUserData } from "@/redux/userSlice";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

const ReportIssue = () => {
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [date] = useState(new Date().toLocaleString());
    const [categoryMessageError, setCategoryMessageError] = useState('')
    const [contentMessageError, setContentMessageError] = useState('')
    const { colors } = useTheme()

    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
    
        if (currentUser?.email) {
            dispatch(fetchUserData(currentUser.email));
        }
    }, [dispatch]);
    
    const categories = [
        { label: 'Report a problem', value: 'issue' },
        { label: 'Possible improvement', value: 'improvement' },
        { label: 'General feedback', value: 'feedback' },
    ];

    const sendReport = async ()  => {

        if(category === '') {
            setCategoryMessageError('* Please select a subject')
            return
        }
        setCategoryMessageError('')

        if(message.length > 5) {
            setContentMessageError('*Max 2300 caracters')
            return
        }
        setContentMessageError('')

        const title = `Report: ${category ? category : 'General Feedback'} - ${date}`;
        const reportContent = `${message}`;
        try {
            await addDoc(collection(firestore, "MessageReport"), {
                title: title,
                email: user?.email,
                message: reportContent,
                date: date,
                category: category ? category : 'General Feedback',
            });
    
            Alert.alert('Report successfully saved');
            resetForm()
        } catch (error) {
            console.error('Error saving report: ', error);
            Alert.alert('Error saving report');
        }
    };

    const resetForm = () => {
        setMessage('')
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Report an Issue</Text>

        <Text style={styles.label}>Select Subject</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a category" value="" />
                    {categories.map((cat) => (
                        <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                    ))}
                </Picker>
            </View>
        {categoryMessageError && <Text style={styles.errorMessage}>{categoryMessageError}</Text>}

        <Text style={styles.label}>Your Message</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Describe your issue or feedback... (max 2300 caracters)"
            value={message}
            onChangeText={setMessage}
            multiline
        />
        {contentMessageError && <Text style={styles.errorMessage}>{contentMessageError}</Text>}

        <Text style={[styles.label]}>Date: {date}</Text>

        <Button title="Send Report" color={colors.blackFix} onPress={sendReport} />
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    picker: {
        height: 55,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        marginTop: -12
    },
    options: {
        marginTop: -12
    }
});

export default ReportIssue;