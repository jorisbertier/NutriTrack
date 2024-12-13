import { ThemedText } from '@/components/ThemedText';
import { fetchUserIdDataConnected } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider'
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore } from '@/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

function CreateAliment() {

    const {colors} = useTheme();

    /*Get id user*/
    const [userIdConnected, setUserIdConnected] = useState<number>();
    const auth = getAuth();
    const user = auth.currentUser;

    const quantityRef = useRef(null);
    const unitRef = useRef(null);
    const caloriesRef = useRef(null);
    const proteinsRef = useRef(null);
    const carbsRef = useRef(null);
    const fatsRef = useRef(null);

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
    const [titleError, setTitleError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [unitError, setUnitError] = useState('');
    const [caloriesError, setCaloriesError] = useState('');
    const [proteinsError, setProteinsError] = useState('');
    const [carbsError, setCarbsError] = useState('');
    const [fatsError, setFatsError] = useState('');
    const [magnesiumError, setMagnesiumError] = useState('');
    const [potassiumError, setPotassiumError] = useState('');
    const [calciumError, setCalciumError] = useState('');
    const [sodiumError, setSodiumError] = useState('');
    const [ironError, setIronError] = useState('');
    const [folateError, setFolateError] = useState('');
    const [sugarError, setSugarError] = useState('');
    const [vitaminAError, setVitaminAError] = useState('');
    const [vitaminB1Error, setVitaminB1Error] = useState('');
    const [vitaminB5Error, setVitaminB5Error] = useState('');
    const [vitaminB6Error, setVitaminB6Error] = useState('');
    const [vitaminB12Error, setVitaminB12Error] = useState('');
    const [vitaminCError, setVitaminCError] = useState('');
    const [vitaminDError, setVitaminDError] = useState('');
    const [vitaminEError, setVitaminEError] = useState('');
    const [vitaminKError, setVitaminKError] = useState('');

    useEffect(() => {
        try {
            const fetch = async () => {
                fetchUserIdDataConnected(user, setUserIdConnected)
            }
            fetch()
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, [user]);

    const validateFields = () => {
        let isValid = true;

        if (!title.trim()) {
            setTitleError('Name is required.');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(title)) {
            setTitleError('Name must contain only letters.');
            isValid = false;
        } else if(title.length > 15) {
            setTitleError('Name must contain 15 caracters maximum.');
            isValid = false;
        }
        else {
            setTitleError('');
        }

        if (!['g', 'cl', 'ml', 'cup', 'l'].includes(unit.toLowerCase())) {
            isValid = false;
            setUnitError('The unit must only contain g / cl / ml / l / cup');
        } else {
            setUnitError('');
        }

        const quantityNumber = parseFloat(quantity);
        if (!quantityNumber || isNaN(quantityNumber) || quantityNumber > 1000 || quantityNumber < 0) {
            setQuantityError('Please enter in centimeters a valid height. Max 1000');
            isValid = false;
        } else {
            setQuantityError('');
        }

        const caloriesNumber = parseFloat(calories);
        if (!caloriesNumber || isNaN(caloriesNumber) || caloriesNumber > 1500 || caloriesNumber < 0) {
            setCaloriesError('Please enter in centimeters a valid height. Max 1000');
            isValid = false;
        } else {
            setCaloriesError('');
        }

        const carbsNumber = parseFloat(carbs);
        if (!carbsNumber || isNaN(carbsNumber) || carbsNumber > 200 || carbsNumber < 0) {
            setCarbsError('Please enter a valid number of carbs. Max 1000');
            isValid = false;
        } else {
            setCarbsError('');
        }

        const proteinsNumber = parseFloat(proteins);
        if (!proteinsNumber || isNaN(proteinsNumber) || proteinsNumber > 200 || proteinsNumber < 0) {
            setProteinsError('Please enter a valid number of calories. Max 200');
            isValid = false;
        } else {
            setProteinsError('');
        }

        const fatsNumber = parseFloat(fats);
        if (!fatsNumber || isNaN(fatsNumber) || fatsNumber > 600 || fatsNumber < 0) {
            setFatsError('Please enter a valid number of fats. Max 600');
            isValid = false;
        } else {
            setFatsError('');
        }
        const magnesiumNumber = parseFloat(magnesium);
        if (magnesiumNumber > 300 || magnesiumNumber < 0) {
            setMagnesiumError('Please enter a valid number of Magnesium. Max 300');
            isValid = false;
        } else {
            setMagnesiumError('');
        }
        const potassiumNumber = parseFloat(potassium);
        if (potassiumNumber > 4500 || potassiumNumber < 0) {
            setPotassiumError('Please enter a valid number of Potassium. Max 4500');
            isValid = false;
        } else {
            setPotassiumError('');
        }
        const calciumNumber = parseFloat(calcium);
        if (calciumNumber > 1300 || calciumNumber < 0) {
            setCalciumError('Please enter a valid number of Calcium. Max 1300');
            isValid = false;
        } else {
            setCalciumError('');
        }
    
        const sodiumNumber = parseFloat(sodium);
        if (sodiumNumber > 1300 || sodiumNumber < 0) {
            setSodiumError('Please enter a valid number of sodium. Max 1300');
            isValid = false;
        } else {
            setSodiumError('');
        }
    
        const ironNumber = parseFloat(iron);
        if (ironNumber > 1300 || ironNumber < 0) {
            setIronError('Please enter a valid number of Calcuim. Max 45');
            isValid = false;
        } else {
            setIronError('');
        }
        const folateNumber = parseFloat(folate);
        if (folateNumber > 400 || folateNumber < 0) {
            setFolateError('Please enter a valid number of Folate. Max 400');
            isValid = false;
        } else {
            setFolateError('');
        }
        const sugarNumber = parseFloat(sugar);
        if (sugarNumber > 100 || sugarNumber < 0) {
            setSugarError('Please enter a valid number of iron. Max 100');
            isValid = false;
        } else {
            setSugarError('');
        }
        const vitaminANumber = parseFloat(vitaminA);
        if (vitaminANumber > 2000 || vitaminANumber < 0) {
            setVitaminAError('Please enter a valid number of vitamin a. Max 2000');
            isValid = false;
        } else {
            setVitaminAError('');
        }
        const vitaminB1Number = parseFloat(vitaminB1);
        if (vitaminB1Number > 1.2 || vitaminB1Number < 0) {
            setVitaminB1Error('Please enter a valid number of vitamin b1. Max 1.2');
            isValid = false;
        } else {
            setVitaminB1Error('');
        }
        const vitaminB5Number = parseFloat(vitaminB5);
        if (vitaminB5Number > 5 || vitaminB5Number < 0) {
            setVitaminB5Error('Please enter a valid number of vitamin b5. Max 5');
            isValid = false;
        } else {
            setVitaminB5Error('');
        }
        const vitaminB6Number = parseFloat(vitaminB6);
        if (vitaminB6Number > 1.3 || vitaminB6Number < 0) {
            setVitaminB6Error('Please enter a valid number of vitamin b6. Max 1.3');
            isValid = false;
        } else {
            setVitaminB6Error('');
        }
        const vitaminB12Number = parseFloat(vitaminB12);
        if (vitaminB12Number > 2.4 || vitaminB12Number < 0) {
            setVitaminB12Error('Please enter a valid number of vitamin b12. Max 1.3');
            isValid = false;
        } else {
            setVitaminB12Error('');
        }
        const vitaminCNumber = parseFloat(vitaminC);
        if (vitaminCNumber > 130 || vitaminCNumber < 0) {
            setVitaminCError('Please enter a valid number of vitamin c. Max 130');
            isValid = false;
        } else {
            setVitaminCError('');
        }
        const vitaminDNumber = parseFloat(vitaminD);
        if (vitaminDNumber > 15 || vitaminDNumber < 0) {
            setVitaminDError('Please enter a valid number of vitamin D. Max 15');
            isValid = false;
        } else {
            setVitaminDError('');
        }
        const vitaminENumber = parseFloat(vitaminE);
        if (vitaminENumber > 15 || vitaminENumber < 0) {
            setVitaminEError('Please enter a valid number of vitamin E. Max 15');
            isValid = false;
        } else {
            setVitaminEError('');
        }
        const vitaminKNumber = parseFloat(vitaminE);
        if (vitaminKNumber > 130 || vitaminKNumber < 0) {
            setVitaminKError('Please enter a valid number of vitamin K. Max 130');
            isValid = false;
        } else {
            setVitaminKError('');
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

            console.log(dataToSave)

            Object.keys(dataToSave).forEach((key) => {
                if (dataToSave[key] === null || dataToSave[key] === undefined || dataToSave[key] === '') {
                    delete dataToSave[key];
                }
            });

            console.log(dataToSave)

            await setDoc(doc(firestore, "UserCreatedFoods",  generateManualId()), {
                id: newId,
                title: title,
                quantity: Number(quantity),
                unit: unit.toLowerCase(),
                calories: Number(calories),
                proteins: Number(proteins),
                carbohydrates: Number(carbs),
                fats: Number(fats),
                idUser: Number(userIdConnected),
                ...dataToSave
            });
            Alert.alert('Aliment created')

        } catch(error: any) {
            Alert.alert('Create an aliment error', error.message)
        }
    }
    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.whiteMode}]} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[styles.label, {color : colors.black}]}>Name -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Name (required)"
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize='words'
                    returnKeyType='next'
                    onSubmitEditing={() => quantityRef.current?.focus()}
                />
                {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Quantity -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Quantity (required)"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={quantityRef} // Lier la référence
                    onSubmitEditing={() => unitRef.current?.focus()} 
                />
                {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Unit /g, ml, cup, slice -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Unit (required)"
                    value={unit}
                    onChangeText={setUnit}
                    autoCapitalize='words'
                    returnKeyType="next"
                    ref={unitRef} // Lier la référence
                    onSubmitEditing={() => caloriesRef.current?.focus()} 
                />
                <ThemedText style={[{color : colors.black, marginBottom: 10}]}>* The unit must only contain g / cl / ml / l / cup</ThemedText>
                {unitError ? <Text style={styles.errorText}>{unitError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Calories -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Calories (required)"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={caloriesRef} // Lier la référence
                    onSubmitEditing={() => proteinsRef.current?.focus()}
                />
                {caloriesError ? <Text style={styles.errorText}>{caloriesError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Proteins -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Proteins (required)"
                    value={proteins}
                    onChangeText={setProteins}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={proteinsRef} // Lier la référence
                    onSubmitEditing={() => carbsRef.current?.focus()}
                />
                {proteinsError ? <Text style={styles.errorText}>{proteinsError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Carbohydrates -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Carbohydrates (required)"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                    returnKeyType="next"
                    ref={carbsRef} // Lier la référence
                    onSubmitEditing={() => fatsRef.current?.focus()}
                />
                {carbsError ? <Text style={styles.errorText}>{carbsError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Fats -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Fats (required)"
                    value={fats}
                    onChangeText={setFats}
                    keyboardType="numeric"
                    returnKeyType="done"
                    ref={fatsRef}
                />
                {fatsError ? <Text style={styles.errorText}>{fatsError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Others macronutrient (optional)-</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Magnesium (optional) max 350"
                    value={magnesium}
                    onChangeText={setMagnesium}
                    keyboardType="numeric"
                />
                {magnesiumError ? <Text style={styles.errorText}>{magnesiumError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Potassium (optional) max 4700"
                    value={potassium}
                    onChangeText={setPotassium}
                    keyboardType="numeric"
                />
                {potassiumError ? <Text style={styles.errorText}>{potassiumError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Calcium (optional) max 1300"
                    value={calcium}
                    onChangeText={setCalcium}
                    keyboardType="numeric"
                />
                {calciumError ? <Text style={styles.errorText}>{calciumError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Sodium (optional) max 1300"
                    value={sodium}
                    onChangeText={setSodium}
                    keyboardType="numeric"
                />
                {sodiumError ? <Text style={styles.errorText}>{sodiumError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Iron (optional) max 45"
                    value={iron}
                    onChangeText={setIron}
                    keyboardType="numeric"
                />
                {ironError ? <Text style={styles.errorText}>{ironError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Sugar (optional) max 100"
                    value={sugar}
                    onChangeText={setSugar}
                    keyboardType="numeric"
                />
                {sugarError ? <Text style={styles.errorText}>{sugarError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Folate (optional) max 400"
                    value={folate}
                    onChangeText={setFolate}
                    keyboardType="numeric"
                />
                {folateError ? <Text style={styles.errorText}>{folateError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminA (optional)(value µg) max 2000"
                    value={vitaminA}
                    onChangeText={setVitaminA}
                    keyboardType="numeric"
                />
                {vitaminAError ? <Text style={styles.errorText}>{vitaminAError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminB1 (optional)(value mg) max 1.2"
                    value={vitaminB1}
                    onChangeText={setVitaminB1}
                    keyboardType="numeric"
                />
                {vitaminB1Error ? <Text style={styles.errorText}>{vitaminB1Error}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminB5 (optional)(value mg) max 5"
                    value={vitaminB5}
                    onChangeText={setVitaminB5}
                    keyboardType="numeric"
                />
                {vitaminB5Error ? <Text style={styles.errorText}>{vitaminB5Error}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminB6 (optional)(value mg) max 1.3"
                    value={vitaminB6}
                    onChangeText={setVitaminB6}
                    keyboardType="numeric"
                />
                {vitaminB6Error ? <Text style={styles.errorText}>{vitaminB6Error}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminB12 (optional)(value µg) max 2.4"
                    value={vitaminB12}
                    onChangeText={setVitaminB12}
                    keyboardType="numeric"
                />
                {vitaminB12Error ? <Text style={styles.errorText}>{vitaminB12Error}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminC (optional)(value mg) max 130"
                    value={vitaminC}
                    onChangeText={setVitaminC}
                    keyboardType="numeric"
                />
                {vitaminCError ? <Text style={styles.errorText}>{vitaminCError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminD (optional)(value µg) max 15"
                    value={vitaminD}
                    onChangeText={setVitaminD}
                    keyboardType="numeric"
                />
                {vitaminDError ? <Text style={styles.errorText}>{vitaminDError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminE (optional)(value mg) max 15"
                    value={vitaminE}
                    onChangeText={setVitaminE}
                    keyboardType="numeric"
                />
                {vitaminEError ? <Text style={styles.errorText}>{vitaminEError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="VitaminK (optional)(value µg) max 100"
                    value={vitaminK}
                    onChangeText={setVitaminK}
                    keyboardType="numeric"
                />
                {folateError ? <Text style={styles.errorText}>{folateError}</Text> : null}
                
                <TouchableOpacity
                    onPress={createAliment}
                    style={{
                    backgroundColor: colors.black,
                    padding: 10,
                    marginBottom: 100,
                    marginTop: 30,
                    borderRadius: 3,
                    alignItems: 'center',
                    }}
                >
                <Text style={{ color: colors.white}}>Create aliment</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 3,
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

});

export default CreateAliment