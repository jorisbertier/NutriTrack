import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore, getAuth } from '@/firebaseConfig';
import { User } from "@/interface/User";
import { fetchUserDataConnected } from "@/functions/function";
import { ThemedText } from "../ThemedText";

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


    const [title, setTitle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [calories, setCalories] = useState('');
    const [proteins, setProteins] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [magnesium, setMagnesium] = useState('')
    const [potassium, setPotassium] = useState('');
    const [calcium, setCalcium] = useState('');
    const [sodium, setSodium] = useState('');
    const [iron, setIron] = useState('');
    const [vitaminA, setVitaminA] = useState('');
    const [vitaminB1, setVitaminB1] = useState('');
    const [vitaminB5, setVitaminB5] = useState('');
    const [vitaminB6, setVitaminB6] = useState('');
    const [vitaminB12, setVitaminB12] = useState('');
    const [vitaminC, setVitaminC] = useState('');
    const [vitaminD, setVitaminD] = useState('');
    const [vitaminE, setVitaminE] = useState('');
    const [vitaminK, setVitaminK] = useState('');
    const [folate, setFolate] = useState('');
    const [sugar, setSugar] = useState('');

    /**ERROR MESSAGE */
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const setFieldError = (field: string, message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
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
        let isValid = true;

        if (!title.trim()) {
            setFieldError('title', 'Name is required.');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(title)) {
            setFieldError('title', 'Name must contain only letters.');
            isValid = false;
        } else if(title.length > 15) {
            setFieldError('title', 'Name must contain 15 caracters maximum.');
            isValid = false;
        }
        else {
            setFieldError('title', '');
        }

        if (!['g', 'cl', 'ml', 'cup', 'l'].includes(unit.toLowerCase())) {
            isValid = false;
            setFieldError('unit', 'The unit must only contain g / cl / ml / l / cup');
        } else {
            setFieldError('unit', '');
        }

        const quantityNumber = parseFloat(quantity);

        if (!quantityNumber || isNaN(quantityNumber) || quantityNumber > 1000 || quantityNumber < 0) {
            setFieldError('quantity', 'Please enter a valid number of quantity. Max 1000');
            isValid = false;
        } else {
            setFieldError('quantity', '');
        }

        const caloriesNumber = parseFloat(calories);
        if (!caloriesNumber || isNaN(caloriesNumber) || caloriesNumber > 1500 || caloriesNumber < 0) {
            setFieldError('calories', 'Please enter a valid number of calories. Max 1000');
            isValid = false;
        } else {
            setFieldError('calories', '');
        }

        const carbsNumber = parseFloat(carbs);
        if (!carbsNumber || isNaN(carbsNumber) || carbsNumber > 200 || carbsNumber < 0) {
            setFieldError('carbs', 'Please enter a valid number of carbs. Max 1000');
            isValid = false;
        } else {
            setFieldError('carbs', '');
        }

        const proteinsNumber = parseFloat(proteins);
        if (!proteinsNumber || isNaN(proteinsNumber) || proteinsNumber > 200 || proteinsNumber < 0) {
            setFieldError('proteins', 'Please enter a valid number of proteins. Max 200');
            isValid = false;
        } else {
            setFieldError('proteins', '');
        }

        const fatsNumber = parseFloat(fats);
        if (!fatsNumber || isNaN(fatsNumber) || fatsNumber > 600 || fatsNumber < 0) {
            setFieldError('fats', 'Please enter a valid number of fats. Max 600');
            isValid = false;
        } else {
            setFieldError('fats', '');
        }
        const magnesiumNumber = parseFloat(magnesium);
        if (magnesiumNumber > 300 || magnesiumNumber < 0) {
            setFieldError('magnesium', 'Please enter a valid number of magnesium. Max 300');
            isValid = false;
        } else {
            setFieldError('magnesium', '');
        }
        const potassiumNumber = parseFloat(potassium);
        if (potassiumNumber > 4500 || potassiumNumber < 0) {
            setFieldError('potassium', 'Please enter a valid number of potassium. Max 4500');
            isValid = false;
        } else {
            setFieldError('potassium', '');
        }
        const calciumNumber = parseFloat(calcium);
        if (calciumNumber > 1300 || calciumNumber < 0) {
            setFieldError('calcium', 'Please enter a valid number of calcium. Max 1300');
            isValid = false;
        } else {
            setFieldError('calcium', '');
        }
    
        const sodiumNumber = parseFloat(sodium);
        if (sodiumNumber > 1300 || sodiumNumber < 0) {
            setFieldError('sodium', 'Please enter a valid number of sodium. Max 1300');
            isValid = false;
        } else {
            setFieldError('sodium', '');
        }
    
        const ironNumber = parseFloat(iron);
        if (ironNumber > 1300 || ironNumber < 0) {
            setFieldError('iron', 'Please enter a valid number of iron. Max 45');
            isValid = false;
        } else {
            setFieldError('iron', '');
        }
        const folateNumber = parseFloat(folate);
        if (folateNumber > 400 || folateNumber < 0) {
            setFieldError('folate', 'Please enter a valid number of folate. Max 400');
            isValid = false;
        } else {
            setFieldError('folate', '');
        }
        const sugarNumber = parseFloat(sugar);
        if (sugarNumber > 100 || sugarNumber < 0) {
            setFieldError('sugar','Please enter a valid number of sugar. Max 100');
            isValid = false;
        } else {
            setFieldError('sugar','');
        }
        const vitaminANumber = parseFloat(vitaminA);
        if (vitaminANumber > 300 || vitaminANumber < 0) {
            setFieldError('vitamina', 'Please enter a valid number of vitamin A. Max 300');
            isValid = false;
        } else {
            setFieldError('vitamina', '');
        }
        const vitaminB1Number = parseFloat(vitaminB1);
        if (vitaminB1Number > 300 || vitaminB1Number < 0) {
            setFieldError('vitaminb1', 'Please enter a valid number of vitamin B1. Max 300');
            isValid = false;
        } else {
            setFieldError('vitaminb1', '');
        }
        const vitaminB5Number = parseFloat(vitaminB5);
        if (vitaminB5Number > 300 || vitaminB5Number < 0) {
            setFieldError('vitaminb5', 'Please enter a valid number of vitamin B5. Max 300');
            isValid = false;
        } else {
            setFieldError('vitaminb5', '');
        }
        const vitaminB6Number = parseFloat(vitaminB6);
        if (vitaminB6Number > 300 || vitaminB6Number < 0) {
            setFieldError('vitaminb6', 'Please enter a valid number of vitamin B6. Max 300');
            isValid = false;
        } else {
            setFieldError('vitaminb6', '');
        }
        const vitaminB12Number = parseFloat(vitaminB12);
        if (vitaminB12Number > 300 || vitaminB12Number < 0) {
            setFieldError('vitaminb12', 'Please enter a valid number of vitamin B12. Max 300');
            isValid = false;
        } else {
            setFieldError('vitaminb12', '');
        }
        const vitaminCNumber = parseFloat(vitaminC);
        if (vitaminCNumber > 300 || vitaminCNumber < 0) {
            setFieldError('vitaminc', 'Please enter a valid number of vitamin C. Max 300');
            isValid = false;
        } else {
            setFieldError('vitaminc', '');
        }
        const vitaminDNumber = parseFloat(vitaminD);
        if (vitaminDNumber > 300 || vitaminDNumber < 0) {
            setFieldError('vitamind', 'Please enter a valid number of vitamin D. Max 300');
            isValid = false;
        } else {
            setFieldError('vitamind', '');
        }
        const vitaminENumber = parseFloat(vitaminE);
        if (vitaminENumber > 300 || vitaminENumber < 0) {
            setFieldError('vitamine', 'Please enter a valid number of vitamin E. Max 300');
            isValid = false;
        } else {
            setFieldError('vitamine', '');
        }
        const vitaminKNumber = parseFloat(vitaminK);
        if (vitaminKNumber > 300 || vitaminKNumber < 0) {
            setFieldError('vitamink', 'Please enter a valid number of vitamin K. Max 300');
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
                magnesium: Number(magnesium) || null,
                potassium: Number(potassium) || null,
                calcium: Number(calcium) || null,
                sodium: Number(sodium) || null,
                iron: Number(iron) || null,
                vitaminA: Number(vitaminA) || null,
                vitaminB1: Number(vitaminB1) || null,
                vitaminB5: Number(vitaminB5) || null,
                vitaminB6: Number(vitaminB6) || null,
                vitaminB12: Number(vitaminB12) || null,
                vitaminC: Number(vitaminC) || null,
                vitaminD: Number(vitaminD) || null,
                vitaminE: Number(vitaminE) || null,
                vitaminK: Number(vitaminK) || null,
                folate: Number(folate) || null,
                sugar: Number(sugar) || null,
            };

            Object.keys(dataToSave).forEach((key) => {
                if (dataToSave[key] === null || dataToSave[key] === undefined || dataToSave[key] === '') {
                    delete dataToSave[key];
                }
            });

            await setDoc(doc(firestore, "UserCreatedFoods",  generateManualId()), {
                id: newId,
                title: title,
                quantity: Number(quantity),
                unit: unit.toLowerCase(),
                calories: Number(calories),
                proteins: Number(proteins),
                carbohydrates: Number(carbs),
                fats: Number(fats),
                idUser: userData[0]?.id,
                ...dataToSave
            });
            Alert.alert('Aliment created')
            resetForm()
        } catch(error: any) {
            Alert.alert('Create an aliment error', error.message)
        }
    }

    const resetForm = () => {
        setTitle('')
        setQuantity('')
        setUnit('')
        setCalories('')
        setProteins('')
        setCarbs('')
        setFats('')
        setMagnesium('')
        setPotassium('')
        setCalcium('')
        setSodium('')
        setIron('')
        setVitaminA('')
        setVitaminB1('')
        setVitaminB5('')
        setVitaminB6('')
        setVitaminB12('')
        setVitaminC('')
        setVitaminD('')
        setVitaminE('')
        setVitaminK('')
        setFolate('')
        setSugar('')
    };

        
    return (
        <>
            <Text style={styles.title}>Create a food item and custom all nutrional values as you wish.</Text>
            <Text style={[styles.label, {color : colors.black}]}>Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Name (required)"
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize='words'
                    returnKeyType='next'
                    onSubmitEditing={() => quantityRef.current?.focus()}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Quantity</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Quantity (required)"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={quantityRef}
                    onSubmitEditing={() => unitRef.current?.focus()} 
                />
                {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Unit /g, ml, cup, slice</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Unit (required)"
                    value={unit}
                    onChangeText={setUnit}
                    autoCapitalize='words'
                    returnKeyType="next"
                    ref={unitRef} // Lier la référence
                    onSubmitEditing={() => caloriesRef.current?.focus()} 
                />
                <ThemedText style={[{color : colors.black, marginBottom: 10}]}>* The unit must only contain g / cl / ml / l / cup</ThemedText>
                {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Calories -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Calories (required)"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={caloriesRef} // Lier la référence
                    onSubmitEditing={() => proteinsRef.current?.focus()}
                />
                {errors.calories && <Text style={styles.errorText}>{errors.calories}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Proteins</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Proteins (required)"
                    value={proteins}
                    onChangeText={setProteins}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={proteinsRef} // Lier la référence
                    onSubmitEditing={() => carbsRef.current?.focus()}
                />
                {errors.proteins && <Text style={styles.errorText}>{errors.proteins}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Carbohydrates</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Carbohydrates (required)"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={carbsRef} // Lier la référence
                    onSubmitEditing={() => fatsRef.current?.focus()}
                />
                {errors.carbs && <Text style={styles.errorText}>{errors.carbs}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Fats</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Fats (required)"
                    value={fats}
                    onChangeText={setFats}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={fatsRef}
                    onSubmitEditing={() => magnesiumRef.current?.focus()}
                />
                {errors.fats && <Text style={styles.errorText}>{errors.fats}</Text>}
                <Text style={[styles.label, {color : colors.black}]}>Others macronutrient (optional)-</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Magnesium (optional) max 350"
                    value={magnesium}
                    onChangeText={setMagnesium}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={magnesiumRef}
                    onSubmitEditing={() => potassiumRef.current?.focus()}
                />
                {errors.mangesium && <Text style={styles.errorText}>{errors.mangesium}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Potassium (optional) max 4700"
                    value={potassium}
                    onChangeText={setPotassium}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={potassiumRef}
                    onSubmitEditing={() => calciumRef.current?.focus()}
                />
                {errors.potassium && <Text style={styles.errorText}>{errors.potassium}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Calcium (optional) max 1300"
                    value={calcium}
                    onChangeText={setCalcium}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={calciumRef}
                    onSubmitEditing={() => sodiumRef.current?.focus()}
                />
                {errors.calcium && <Text style={styles.errorText}>{errors.calcium}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Sodium (optional) max 1300"
                    value={sodium}
                    onChangeText={setSodium}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={sodiumRef}
                    onSubmitEditing={() => ironRef.current?.focus()}
                />
                {errors.sodium && <Text style={styles.errorText}>{errors.sodium}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Iron (optional) max 45"
                    value={iron}
                    onChangeText={setIron}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={ironRef}
                    onSubmitEditing={() => sugarRef.current?.focus()}
                />
                {errors.iron && <Text style={styles.errorText}>{errors.iron}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Sugar (optional) max 100"
                    value={sugar}
                    onChangeText={setSugar}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={sugarRef}
                    onSubmitEditing={() => folateRef.current?.focus()}
                />
                {errors.sugar && <Text style={styles.errorText}>{errors.sugar}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="Folate (optional) max 400"
                    value={folate}
                    onChangeText={setFolate}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={folateRef}
                    onSubmitEditing={() => vitaminARef.current?.focus()}
                />
                {errors.folate && <Text style={styles.errorText}>{errors.folate}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminA % (optional) max 300"
                    value={vitaminA}
                    onChangeText={setVitaminA}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminARef}
                    onSubmitEditing={() => vitaminB1Ref.current?.focus()}
                />
                {errors.vitamina && <Text style={styles.errorText}>{errors.vitamina}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminB1 % (optional) max 300"
                    value={vitaminB1}
                    onChangeText={setVitaminB1}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB1Ref}
                    onSubmitEditing={() => vitaminB5Ref.current?.focus()}
                />
                {errors.vitaminb1 && <Text style={styles.errorText}>{errors.vitaminb1}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminB5 % (optional) max 300"
                    value={vitaminB5}
                    onChangeText={setVitaminB5}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB5Ref}
                    onSubmitEditing={() => vitaminB6Ref.current?.focus()}
                />
                {errors.vitaminb5 && <Text style={styles.errorText}>{errors.vitaminb5}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminB6 % (optional) max 300"
                    value={vitaminB6}
                    onChangeText={setVitaminB6}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB6Ref}
                    onSubmitEditing={() => vitaminB12Ref.current?.focus()}
                />
                {errors.vitaminb6 && <Text style={styles.errorText}>{errors.vitaminb6}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminB12 % (optional) max 300"
                    value={vitaminB12}
                    onChangeText={setVitaminB12}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminB12Ref}
                    onSubmitEditing={() => vitaminCRef.current?.focus()}
                />
                {errors.vitaminb12 && <Text style={styles.errorText}>{errors.vitaminb12}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminC % (optional) max 300"
                    value={vitaminC}
                    onChangeText={setVitaminC}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminCRef}
                    onSubmitEditing={() => vitaminDRef.current?.focus()}
                />
                {errors.vitaminc && <Text style={styles.errorText}>{errors.vitaminc}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminD % (optional) max 300"
                    value={vitaminD}
                    onChangeText={setVitaminD}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminDRef}
                    onSubmitEditing={() => vitaminERef.current?.focus()}
                />
                {errors.vitamind && <Text style={styles.errorText}>{errors.vitamind}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminE % (optional) max 300"
                    value={vitaminE}
                    onChangeText={setVitaminE}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={vitaminERef}
                    onSubmitEditing={() => vitaminKRef.current?.focus()}
                />
                {errors.vitamine && <Text style={styles.errorText}>{errors.vitamine}</Text>}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminK % (optional) max 300"
                    value={vitaminK}
                    onChangeText={setVitaminK}
                    keyboardType="numeric"
                    returnKeyType="done"
                    ref={vitaminKRef}
                />
                {errors.vitamink && <Text style={styles.errorText}>{errors.vitamink}</Text>}
                
                <TouchableOpacity
                    onPress={createAliment}
                    style={[styles.button, { backgroundColor: colors.black }]}
                >
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>Create an aliment</Text>
                </TouchableOpacity>
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
        borderColor: '#ccc',
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
        borderRadius: 30,
        marginTop: 20,
        marginBottom: 70
    },
});
export default Create;