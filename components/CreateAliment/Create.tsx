import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore, getAuth } from '@/firebaseConfig';
import { User } from "@/interface/User";
import { fetchUserDataConnected } from "@/functions/function";
import { ThemedText } from "../ThemedText";
import LottieView from "lottie-react-native";

function Create() {
    const {colors} = useTheme();
    
    /*Get id user*/
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const { t } = useTranslation();

    const quantityRef = useRef(null);
    const unitRef = useRef(null);
    const caloriesRef = useRef(null);
    const proteinsRef = useRef(null);
    const carbsRef = useRef(null);
    const fatsRef = useRef(null);
    const magnesiumRef = useRef(null);
    const potassiumRef = useRef(null);
    const calciumRef = useRef(null);
    const sodiumRef = useRef(null);
    const ironRef = useRef(null);
    const sugarRef = useRef(null);
    const folateRef = useRef(null);
    const vitaminARef = useRef(null);
    const vitaminB1Ref = useRef(null);
    const vitaminB5Ref = useRef(null);
    const vitaminB6Ref = useRef(null);
    const vitaminB12Ref = useRef(null);
    const vitaminCRef = useRef(null);
    const vitaminDRef = useRef(null);
    const vitaminERef = useRef(null);
    const vitaminKRef = useRef(null);

    const [ showModal, setShowModal] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        quantity: '',
        unit: '',
        calories: '',
        proteins: '',
        carbs: '',
        fats: '',
        magnesium: '',
        potassium: '',
        calcium: '',
        sodium: '',
        iron: '',
        vitaminA: '',
        vitaminB1: '',
        vitaminB5: '',
        vitaminB6: '',
        vitaminB12: '',
        vitaminC: '',
        vitaminD: '',
        vitaminE: '',
        vitaminK: '',
        folate: '',
        sugar: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    /**ERROR MESSAGE */
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const setFieldError = (field: string, message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    };

    /* FOCUSED */
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: false }));
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

    const validateFields = () => {
        console.log(formValues)
        let isValid = true;

        if (!formValues.title.trim()) {
            setFieldError('title', t('titleRequired'));
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formValues.title)) {
            setFieldError('title', t('titleLettersOnly'));
            isValid = false;
        } else if(formValues.title.length > 15) {
            setFieldError('title', t('titleMaxLength'));
            isValid = false;
        }
        else {
            setFieldError('title', '');
        }

        if (!['g', 'cl', 'ml', 'cup', 'l'].includes(formValues.unit.toLowerCase())) {
            isValid = false;
            setFieldError('unit', t('inform'));
        } else {
            setFieldError('unit', '');
        }

        const quantityNumber = parseFloat(formValues.quantity);

        if (!quantityNumber || isNaN(quantityNumber) || quantityNumber > 1000 || quantityNumber < 0) {
            setFieldError('quantity', 'Please enter a valid number of quantity. Max 1000');
            setFieldError('quantity', `${t('errorValidNumber')} ${t('quantity')}. Max 1000`);
            isValid = false;
        } else {
            setFieldError('quantity', '');
        }

        const caloriesNumber = parseFloat(formValues.calories);
        if (!caloriesNumber || isNaN(caloriesNumber) || caloriesNumber > 1500 || caloriesNumber < 0) {
            setFieldError('calories', `${t('errorValidNumber')} ${t('calories')}. Max 1000`);
            isValid = false;
        } else {
            setFieldError('calories', '');
        }

        const carbsNumber = parseFloat(formValues.carbs);
        if (!carbsNumber || isNaN(carbsNumber) || carbsNumber > 200 || carbsNumber < 0) {
            setFieldError('carbs', `${t('errorValidNumber')} ${t('carbs')}. Max 1000`);
            isValid = false;
        } else {
            setFieldError('carbs', '');
        }

        const proteinsNumber = parseFloat(formValues.proteins);
        if (!proteinsNumber || isNaN(proteinsNumber) || proteinsNumber > 200 || proteinsNumber < 0) {
            setFieldError('proteins', `${t('errorValidNumber')} ${t('proteins')}. Max 200`);
            isValid = false;
        } else {
            setFieldError('proteins', '');
        }

        const fatsNumber = parseFloat(formValues.fats);
        if (!fatsNumber || isNaN(fatsNumber) || fatsNumber > 600 || fatsNumber < 0) {
            setFieldError('fats', `${t('errorValidNumber')} ${t('fats')}. Max 600`);
            isValid = false;
        } else {
            setFieldError('fats', '');
        }
        const magnesiumNumber = parseFloat(formValues.magnesium);
        if (magnesiumNumber > 300 || magnesiumNumber < 0) {
            setFieldError('magnesium', 'Please enter a valid number of magnesium. Max 300');
            setFieldError('magnesium', `${t('errorValidNumber')} ${t('magnesium')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('magnesium', '');
        }
        const potassiumNumber = parseFloat(formValues.potassium);
        if (potassiumNumber > 4500 || potassiumNumber < 0) {
            setFieldError('potassium', `${t('errorValidNumber')} ${t('potassium')}. Max 4500`);
            isValid = false;
        } else {
            setFieldError('potassium', '');
        }
        const calciumNumber = parseFloat(formValues.calcium);
        if (calciumNumber > 1300 || calciumNumber < 0) {
            setFieldError('calcium', `${t('errorValidNumber')} ${t('calcium')}. Max 1300`);
            isValid = false;
        } else {
            setFieldError('calcium', '');
        }
    
        const sodiumNumber = parseFloat(formValues.sodium);
        if (sodiumNumber > 1300 || sodiumNumber < 0) {
            setFieldError('sodium', `${t('errorValidNumber')} ${t('sodium')}. Max 1300`);
            isValid = false;
        } else {
            setFieldError('sodium', '');
        }
    
        const ironNumber = parseFloat(formValues.iron);
        if (ironNumber > 45 || ironNumber < 0) {
            setFieldError('iron', `${t('errorValidNumber')} ${t('iron')}. Max 45`);
            isValid = false;
        } else {
            setFieldError('iron', '');
        }
        const folateNumber = parseFloat(formValues.folate);
        if (folateNumber > 400 || folateNumber < 0) {
            setFieldError('folate', `${t('errorValidNumber')} ${t('folate')}. Max 400`);
            isValid = false;
        } else {
            setFieldError('folate', '');
        }
        const sugarNumber = parseFloat(formValues.sugar);
        if (sugarNumber > 100 || sugarNumber < 0) {
            setFieldError('sugar','Please enter a valid number of sugar. Max 100');
            setFieldError('sugar', `${t('errorValidNumber')} ${t('sugar')}. Max 100`);
            isValid = false;
        } else {
            setFieldError('sugar','');
        }
        const vitaminANumber = parseFloat(formValues.vitaminA);
        if (vitaminANumber > 300 || vitaminANumber < 0) {
            setFieldError('vitamina', `${t('errorValidNumber')} ${t('vitaminA')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitamina', '');
        }
        const vitaminB1Number = parseFloat(formValues.vitaminB1);
        if (vitaminB1Number > 300 || vitaminB1Number < 0) {
            setFieldError('vitaminb1', `${t('errorValidNumber')} ${t('vitaminB1')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitaminb1', '');
        }
        const vitaminB5Number = parseFloat(formValues.vitaminB5);
        if (vitaminB5Number > 300 || vitaminB5Number < 0) {
            setFieldError('vitaminb5', `${t('errorValidNumber')} ${t('vitaminB5')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitaminb5', '');
        }
        const vitaminB6Number = parseFloat(formValues.vitaminB6);
        if (vitaminB6Number > 300 || vitaminB6Number < 0) {
            setFieldError('vitaminb6', `${t('errorValidNumber')} ${t('vitaminB6')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitaminb6', '');
        }
        const vitaminB12Number = parseFloat(formValues.vitaminB12);
        if (vitaminB12Number > 300 || vitaminB12Number < 0) {
            setFieldError('vitaminb12', `${t('errorValidNumber')} ${t('vitaminB12')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitaminb12', '');
        }
        const vitaminCNumber = parseFloat(formValues.vitaminC);
        if (vitaminCNumber > 300 || vitaminCNumber < 0) {
            setFieldError('vitaminc', `${t('errorValidNumber')} ${t('vitaminC')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitaminc', '');
        }
        const vitaminDNumber = parseFloat(formValues.vitaminD);
        if (vitaminDNumber > 300 || vitaminDNumber < 0) {
            setFieldError('vitamind', `${t('errorValidNumber')} ${t('vitaminD')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitamind', '');
        }
        const vitaminENumber = parseFloat(formValues.vitaminE);
        if (vitaminENumber > 300 || vitaminENumber < 0) {
            setFieldError('vitamine', `${t('errorValidNumber')} ${t('vitaminE')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitamine', '');
        }
        const vitaminKNumber = parseFloat(formValues.vitaminK);
        if (vitaminKNumber > 300 || vitaminKNumber < 0) {
            setFieldError('vitamink', `${t('errorValidNumber')} ${t('vitaminK')}. Max 300`);
            isValid = false;
        } else {
            setFieldError('vitamink', '');
        }
    
        return isValid;
    }

    const generateManualId = () => {
        return `ID-${Date.now()}`;
    }

    const createAliment = async (event: any) => {
        event.preventDefault();
        if(!validateFields()) {
            return;
        }

        try {
            const collectionRef = collection(firestore, "UserCreatedFoods");

            // Récupérez tous les documents de la collection
            const querySnapshot = await getDocs(collectionRef);
        
            // Calculez le prochain ID en trouvant le plus grand ID existant
            let maxId = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.id && data.id > maxId) {
                    maxId = data.id;
                }
            });
        
            const newId = maxId + 1;
        
            const dataToSave = {
                magnesium: Number(formValues.magnesium) || null,
                potassium: Number(formValues.potassium) || null,
                calcium: Number(formValues.calcium) || null,
                sodium: Number(formValues.sodium) || null,
                iron: Number(formValues.iron) || null,
                vitaminA: Number(formValues.vitaminA) || null,
                vitaminB1: Number(formValues.vitaminB1) || null,
                vitaminB5: Number(formValues.vitaminB5) || null,
                vitaminB6: Number(formValues.vitaminB6) || null,
                vitaminB12: Number(formValues.vitaminB12) || null,
                vitaminC: Number(formValues.vitaminC) || null,
                vitaminD: Number(formValues.vitaminD) || null,
                vitaminE: Number(formValues.vitaminE) || null,
                vitaminK: Number(formValues.vitaminK) || null,
                folate: Number(formValues.folate) || null,
                sugar: Number(formValues.sugar) || null,
            };

            Object.keys(dataToSave).forEach((key) => {
                if (dataToSave[key] === null || dataToSave[key] === undefined || dataToSave[key] === '') {
                    delete dataToSave[key];
                }
            });

            await setDoc(doc(firestore, "UserCreatedFoods",  generateManualId()), {
                id: newId,
                title: formValues.title,
                quantity: Number(formValues.quantity),
                unit: formValues.unit.toLowerCase(),
                calories: Number(formValues.calories),
                proteins: Number(formValues.proteins),
                carbohydrates: Number(formValues.carbs),
                fats: Number(formValues.fats),
                idUser: userData[0]?.id,
                ...dataToSave
            });
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2500);
            resetForm();
        } catch(error: any) {
            console.log('Create an aliment error', error.message)
        }
    }

    const resetForm = () => {
        setFormValues({
            title: '',
            quantity: '',
            unit: '',
            calories: '',
            proteins: '',
            carbs: '',
            fats: '',
            magnesium: '',
            potassium: '',
            calcium: '',
            sodium: '',
            iron: '',
            vitaminA: '',
            vitaminB1: '',
            vitaminB5: '',
            vitaminB6: '',
            vitaminB12: '',
            vitaminC: '',
            vitaminD: '',
            vitaminE: '',
            vitaminK: '',
            folate: '',
            sugar: '',
        });
    };

        
    return (
        <>
            <Text style={[styles.title, { color: colors.black}]}>{t('textCreate')}</Text>
            <Text style={[styles.label, {color : colors.black}]}>{t('food')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['title'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('food')} (${t('required')})`}
                    value={formValues.title}
                    onChangeText={value => handleChange('title', value)}
                    placeholderTextColor={colors.black}
                    autoCapitalize='words'
                    returnKeyType='next'
                    onSubmitEditing={() => quantityRef.current?.focus()}
                    onFocus={() => handleFocus('title')}
                    onBlur={() => handleBlur('title')}
                />
                {errors.title && <Text style={[styles.errorText, { color: 'red'}]}>{errors.title}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('quantity')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['quantity'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('quantity')} (${t('required')})`}
                    value={formValues.quantity}
                    onChangeText={value => handleChange('quantity', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={quantityRef}
                    onSubmitEditing={() => unitRef.current?.focus()}
                    onFocus={() => handleFocus('quantity')}
                    onBlur={() => handleBlur('quantity')}
                />
                {errors.quantity && <Text style={[styles.errorText, { color: 'red'}]}>{errors.quantity}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('unit')} {t('informUnit')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['unit'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('unit')} (${t('required')})`}
                    value={formValues.unit}
                    onChangeText={value => handleChange('unit', value)}
                    placeholderTextColor={colors.black}
                    autoCapitalize='words'
                    returnKeyType="next"
                    ref={unitRef} // Lier la référence
                    onSubmitEditing={() => caloriesRef.current?.focus()}
                    onFocus={() => handleFocus('unit')}
                    onBlur={() => handleBlur('unit')}
                />
                <ThemedText style={[{color : colors.black, marginBottom: 10}]}>* {t('inform')}</ThemedText>
                {errors.unit && <Text style={[styles.errorText, { color: 'red'}]}>{errors.unit}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('calories')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['calories'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('calories')} (${t('required')})`}
                    value={formValues.calories}
                    onChangeText={value => handleChange('calories', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={caloriesRef} // Lier la référence
                    onSubmitEditing={() => proteinsRef.current?.focus()}
                    onFocus={() => handleFocus('calories')}
                    onBlur={() => handleBlur('calories')}
                />
                {errors.calories && <Text style={[styles.errorText, { color: 'red'}]}>{errors.calories}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('proteins')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['proteins'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('proteins')} (${t('required')})`}
                    value={formValues.proteins}
                    onChangeText={value => handleChange('proteins', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={proteinsRef} // Lier la référence
                    onSubmitEditing={() => carbsRef.current?.focus()}
                    onFocus={() => handleFocus('proteins')}
                    onBlur={() => handleBlur('proteins')}
                />
                {errors.proteins && <Text style={[styles.errorText, { color: 'red'}]}>{errors.proteins}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('carbs')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['carbs'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('carbs')} (${t('required')})`}
                    value={formValues.carbs}
                    onChangeText={value => handleChange('carbs', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={carbsRef} // Lier la référence
                    onSubmitEditing={() => fatsRef.current?.focus()}
                    onFocus={() => handleFocus('carbs')}
                    onBlur={() => handleBlur('carbs')}
                />
                {errors.carbs && <Text style={[styles.errorText, { color: 'red'}]}>{errors.carbs}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('fats')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['fats'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('fats')} (${t('required')})`}
                    value={formValues.fats}
                    onChangeText={value => handleChange('fats', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={fatsRef}
                    onSubmitEditing={() => magnesiumRef.current?.focus()}
                    onFocus={() => handleFocus('fats')}
                    onBlur={() => handleBlur('fats')}

                />
                {errors.fats && <Text style={[styles.errorText, { color: 'red'}]}>{errors.fats}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>{t('otherMacro')}</Text>
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['magnesium'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('magnesium')} (${t('optional')}) max 300`}
                    value={formValues.magnesium}
                    onChangeText={value => handleChange('magnesium', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={magnesiumRef}
                    onSubmitEditing={() => potassiumRef.current?.focus()}
                    onFocus={() => handleFocus('magnesium')}
                    onBlur={() => handleBlur('magnesium')}
                />
                {errors.magnesium && <Text style={[styles.errorText, { color: 'red'}]}>{errors.magnesium}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['potassium'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('potassium')} (${t('optional')}) max 4700`}
                    value={formValues.potassium}
                    onChangeText={value => handleChange('potassium', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={potassiumRef}
                    onSubmitEditing={() => calciumRef.current?.focus()}
                    onFocus={() => handleFocus('potassium')}
                    onBlur={() => handleBlur('potassium')}
                />
                {errors.potassium && <Text style={[styles.errorText, { color: 'red'}]}>{errors.potassium}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['calcium'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('calcium')} (${t('optional')}) max 1300`}
                    value={formValues.calcium}
                    onChangeText={value => handleChange('calcium', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={calciumRef}
                    onSubmitEditing={() => sodiumRef.current?.focus()}
                    onFocus={() => handleFocus('calcium')}
                    onBlur={() => handleBlur('calcium')}
                />
                {errors.calcium && <Text style={[styles.errorText, { color: 'red'}]}>{errors.calcium}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['sodium'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('sodium')} (${t('optional')}) max 1300`}
                    value={formValues.sodium}
                    onChangeText={value => handleChange('sodium', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={sodiumRef}
                    onSubmitEditing={() => ironRef.current?.focus()}
                    onFocus={() => handleFocus('sodium')}
                    onBlur={() => handleBlur('sodium')}
                />
                {errors.sodium && <Text style={[styles.errorText, { color: 'red'}]}>{errors.sodium}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['iron'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('iron')} (${t('optional')}) max 45`}
                    value={formValues.iron}
                    placeholderTextColor={colors.black}
                    onChangeText={value => handleChange('iron', value)}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={ironRef}
                    onSubmitEditing={() => sugarRef.current?.focus()}
                    onFocus={() => handleFocus('iron')}
                    onBlur={() => handleBlur('iron')}
                />
                {errors.iron && <Text style={[styles.errorText, { color: 'red'}]}>{errors.iron}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['sugar'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('sugar')} (${t('optional')}) max 1300`}
                    value={formValues.sugar}
                    onChangeText={value => handleChange('sugar', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={sugarRef}
                    onSubmitEditing={() => folateRef.current?.focus()}
                    onFocus={() => handleFocus('sugar')}
                    onBlur={() => handleBlur('sugar')}
                />
                {errors.sugar && <Text style={[styles.errorText, { color: 'red'}]}>{errors.sugar}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['folate'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('folate')} (${t('optional')}) max 400`}
                    value={formValues.folate}
                    onChangeText={value => handleChange('folate', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={folateRef}
                    onSubmitEditing={() => vitaminARef.current?.focus()}
                    onFocus={() => handleFocus('folate')}
                    onBlur={() => handleBlur('folate')}
                />
                {errors.folate && <Text style={[styles.errorText, { color: 'red'}]}>{errors.folate}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminA'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminA')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminA}
                    onChangeText={value => handleChange('vitaminA', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminARef}
                    onSubmitEditing={() => vitaminB1Ref.current?.focus()}
                    onFocus={() => handleFocus('vitaminA')}
                    onBlur={() => handleBlur('vitaminA')}
                />
                {errors.vitamina && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitamina}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminB1'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminB1')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminB1}
                    onChangeText={value => handleChange('vitaminB1', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB1Ref}
                    onSubmitEditing={() => vitaminB5Ref.current?.focus()}
                    onFocus={() => handleFocus('vitaminB1')}
                    onBlur={() => handleBlur('vitaminB1')}
                />
                {errors.vitaminb1 && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitaminb1}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminB5'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminB5')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminB5}
                    onChangeText={value => handleChange('vitaminB5', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB5Ref}
                    onSubmitEditing={() => vitaminB6Ref.current?.focus()}
                    onFocus={() => handleFocus('vitaminB5')}
                    onBlur={() => handleBlur('vitaminB5')}
                />
                {errors.vitaminb5 && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitaminb5}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminB6'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminB6')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminB6}
                    onChangeText={value => handleChange('vitaminB6', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB6Ref}
                    onSubmitEditing={() => vitaminB12Ref.current?.focus()}
                    onFocus={() => handleFocus('vitaminB6')}
                    onBlur={() => handleBlur('vitaminB6')}
                />
                {errors.vitaminb6 && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitaminb6}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminB12'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminB12')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminB12}
                    onChangeText={value => handleChange('vitaminB12', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB12Ref}
                    onSubmitEditing={() => vitaminCRef.current?.focus()}
                    onFocus={() => handleFocus('vitaminB12')}
                    onBlur={() => handleBlur('vitaminB12')}
                />
                {errors.vitaminb12 && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitaminb12}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminC'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminC')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminC}
                    onChangeText={value => handleChange('vitaminC', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminCRef}
                    onSubmitEditing={() => vitaminDRef.current?.focus()}
                    onFocus={() => handleFocus('vitaminC')}
                    onBlur={() => handleBlur('vitaminC')}
                />
                {errors.vitaminc && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitaminc}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminD'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminD')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminD}
                    onChangeText={value => handleChange('vitaminD', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminDRef}
                    onSubmitEditing={() => vitaminERef.current?.focus()}
                    onFocus={() => handleFocus('vitaminD')}
                    onBlur={() => handleBlur('vitaminD')}
                />
                {errors.vitamind && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitamind}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminE'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminE')} % (${t('optional')}) max 300`}
                    value={formValues.vitaminE}
                    onChangeText={value => handleChange('vitaminE', value)}
                    placeholderTextColor={colors.black}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminERef}
                    onSubmitEditing={() => vitaminKRef.current?.focus()}
                    onFocus={() => handleFocus('vitaminE')}
                    onBlur={() => handleBlur('vitaminE')}
                />
                {errors.vitamine && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitamine}</Text>}
                <TextInput
                    style={[styles.input, {color: colors.black, backgroundColor : colors.white, borderColor: focusedFields['vitaminK'] ? colors.blackBorder : colors.grayPressBorder}]}
                    placeholder={`${t('vitaminK')} % (${t('optional')}) max 300`}
                    placeholderTextColor={colors.black}
                    value={formValues.vitaminK}
                    onChangeText={value => handleChange('vitaminK', value)}
                    keyboardType="numeric"
                    returnKeyType="done"
                    ref={vitaminKRef}
                    onFocus={() => handleFocus('vitaminK')}
                    onBlur={() => handleBlur('vitaminK')}
                />
                {errors.vitamink && <Text style={[styles.errorText, { color: 'red'}]}>{errors.vitamink}</Text>}
                
                <TouchableOpacity
                    onPress={createAliment}
                    style={[styles.button, { backgroundColor: colors.black }]}
                >
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>{t('buttonCreate')}</Text>
                </TouchableOpacity>
                {showModal && (
                    <LottieView
                        source={require('@/assets/lottie/check-popup.json')}
                        loop={false}
                        autoPlay={true}
                        style={styles.popup}
                    />
                )}
            </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title : {
        fontSize: 16,
        width: '100%',
        textAlign: 'center'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    label: {
        marginTop: 8,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 0,
        marginBottom: 8
    },
    button: {
        height: 50,
        width: '90%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 70,
        margin: 'auto'
    },
    popup : {
        width: 100,
        height: 100,
        position: 'absolute',
        bottom: 150, 
        alignSelf: 'center', 
    }
});
export default Create;