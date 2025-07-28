
import { firestore } from "@/firebaseConfig";
import { useTheme } from "@/hooks/ThemeProvider";
import { RootState } from "@/redux/store";
import { fetchUserData } from "@/redux/userSlice";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import AnimatedToast from "@/components/AnimatedToastProps";

const ReportIssue = () => {

    const { t } = useTranslation();
    const { colors } = useTheme();

    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [date] = useState(new Date().toLocaleString());
    const [categoryMessageError, setCategoryMessageError] = useState('')
    const [contentMessageError, setContentMessageError] = useState('')
    const [ isFocused , setIsFocused] = useState(false);

    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
    };


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
    
        if (currentUser?.email) {
            dispatch(fetchUserData(currentUser.email));
        }
    }, [dispatch]);
    
    const categories = [
        { label: t('reportIssue'), value: 'issue' },
        { label: t('improvement'), value: 'improvement' },
        { label: t('feedback'), value: 'feedback' },
    ];

    const sendReport = async ()  => {

        if(category === '') {
            setCategoryMessageError('* Please select a subject')
            return
        }
        setCategoryMessageError('')

        if(message.length > 2300 || message.length < 10) {
            setContentMessageError('* min 10 caracters & max 2300 caracters')
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
    
            showFeedback('success', t('supportSuccess'));
            resetForm();
        } catch (error) {
            showFeedback('success', t('supportError'));
        }
    };

    const resetForm = () => {
        setMessage('')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('report')}</Text>

            <Text style={styles.label}>{t('subject')}</Text>
                <View style={[styles.pickerContainer, {borderColor: colors.grayDarkFix, backgroundColor: colors.white}]}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label={t('selectCategory')} value="" />
                        {categories.map((cat) => (
                            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                        ))}
                    </Picker>
                </View>
            {categoryMessageError && <Text style={styles.errorMessage}>{categoryMessageError}</Text>}

            <Text style={styles.label}>{t('yourMessage')}</Text>
            <TextInput
                style={[styles.textInput, {borderColor: isFocused ? colors.black : colors.grayDarkFix, backgroundColor: colors.white}]}
                placeholder={t('placeholderMessage')}
                value={message}
                onChangeText={setMessage}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
            />
            {contentMessageError && <Text style={styles.errorMessage}>{contentMessageError}</Text>}

            <Text style={[styles.label]}>{t('date')}: {date}</Text>

            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                <TouchableOpacity
                    onPress={sendReport} 
                    style={[styles.button , { backgroundColor: colors.black}]}
                    >
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>{t('sendReport')}</Text>
                </TouchableOpacity>
            </View>
                {feedback && (
                    <AnimatedToast
                        message={feedback.message}
                        type={feedback.type}
                        onHide={() => setFeedback(null)}
                        height={150}
                    />
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label : {
        fontWeight: 500,
        fontSize: 15,
        marginBottom: 5
    },
    textInput: {
        height: 200,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginTop: 5,
        marginBottom: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    picker: {
        height: 55,
        width: '100%',
        paddingHorizontal: 10,
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        marginTop: -12
    },
    options: {
        marginTop: -12
    },
    button: {
        height: 50,
        width: '90%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
});

export default ReportIssue;