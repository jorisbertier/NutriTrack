import * as React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { fetchUserDataConnected } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider'
import { getAuth } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore } from '@/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/interface/User';
import Generate from '@/components/CreateAliment/Generate';
import { Switch } from 'react-native-paper';



function CreateAliment() {

    const {colors} = useTheme();

    /*Get id user*/
    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

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

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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
        if (vitaminANumber > 300 || vitaminANumber < 0) {
            setVitaminAError('Please enter a valid number of vitamin a. Max 300');
            isValid = false;
        } else {
            setVitaminAError('');
        }
        const vitaminB1Number = parseFloat(vitaminB1);
        if (vitaminB1Number > 300 || vitaminB1Number < 0) {
            setVitaminB1Error('Please enter a valid number of vitamin b1. Max 300');
            isValid = false;
        } else {
            setVitaminB1Error('');
        }
        const vitaminB5Number = parseFloat(vitaminB5);
        if (vitaminB5Number > 300 || vitaminB5Number < 0) {
            setVitaminB5Error('Please enter a valid number of vitamin b5. Max 300');
            isValid = false;
        } else {
            setVitaminB5Error('');
        }
        const vitaminB6Number = parseFloat(vitaminB6);
        if (vitaminB6Number > 300 || vitaminB6Number < 0) {
            setVitaminB6Error('Please enter a valid number of vitamin b6. Max 300');
            isValid = false;
        } else {
            setVitaminB6Error('');
        }
        const vitaminB12Number = parseFloat(vitaminB12);
        if (vitaminB12Number > 300 || vitaminB12Number < 0) {
            setVitaminB12Error('Please enter a valid number of vitamin b12. Max 300');
            isValid = false;
        } else {
            setVitaminB12Error('');
        }
        const vitaminCNumber = parseFloat(vitaminC);
        if (vitaminCNumber > 300 || vitaminCNumber < 0) {
            setVitaminCError('Please enter a valid number of vitamin c. Max 300');
            isValid = false;
        } else {
            setVitaminCError('');
        }
        const vitaminDNumber = parseFloat(vitaminD);
        if (vitaminDNumber > 300 || vitaminDNumber < 0) {
            setVitaminDError('Please enter a valid number of vitamin D. Max 300');
            isValid = false;
        } else {
            setVitaminDError('');
        }
        const vitaminENumber = parseFloat(vitaminE);
        if (vitaminENumber > 300 || vitaminENumber < 0) {
            setVitaminEError('Please enter a valid number of vitamin E. Max 300');
            isValid = false;
        } else {
            setVitaminEError('');
        }
        const vitaminKNumber = parseFloat(vitaminE);
        if (vitaminKNumber > 300 || vitaminKNumber < 0) {
            setVitaminKError('Please enter a valid number of vitamin K. Max 300');
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
        <ScrollView style={[styles.container, { backgroundColor: colors.whiteMode}]} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={{fontSize: 24, fontWeight: 500, margin: 'auto', marginBottom: 10}}>Switch Mode</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                <Text style={{width: 100, textAlign: 'center',fontWeight: 500, fontSize: 19, color: isSwitchOn ? colors.grayDarkFix : colors.black}}>Generate</Text>
                <Switch color='black' value={isSwitchOn} onValueChange={onToggleSwitch} />
                <Text style={{width: 100,fontSize: 20, fontWeight: 500, textAlign: 'center', color: isSwitchOn ? colors.black : colors.grayDarkFix}}>Create</Text>
            </View>
            
            {!isSwitchOn && (
                <Generate/>
            )}
            {isSwitchOn && (
                <>
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
                {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
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
                {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
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
                {unitError ? <Text style={styles.errorText}>{unitError}</Text> : null}
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
                {caloriesError ? <Text style={styles.errorText}>{caloriesError}</Text> : null}
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
                {proteinsError ? <Text style={styles.errorText}>{proteinsError}</Text> : null}
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
                {carbsError ? <Text style={styles.errorText}>{carbsError}</Text> : null}
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
                {fatsError ? <Text style={styles.errorText}>{fatsError}</Text> : null}
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
                {magnesiumError ? <Text style={styles.errorText}>{magnesiumError}</Text> : null}
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
                {potassiumError ? <Text style={styles.errorText}>{potassiumError}</Text> : null}
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
                {calciumError ? <Text style={styles.errorText}>{calciumError}</Text> : null}
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
                {sodiumError ? <Text style={styles.errorText}>{sodiumError}</Text> : null}
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
                {ironError ? <Text style={styles.errorText}>{ironError}</Text> : null}
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
                {sugarError ? <Text style={styles.errorText}>{sugarError}</Text> : null}
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
                {folateError ? <Text style={styles.errorText}>{folateError}</Text> : null}
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
                {vitaminAError ? <Text style={styles.errorText}>{vitaminAError}</Text> : null}
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
                {vitaminB1Error ? <Text style={styles.errorText}>{vitaminB1Error}</Text> : null}
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
                {vitaminB5Error ? <Text style={styles.errorText}>{vitaminB5Error}</Text> : null}
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
                {vitaminB6Error ? <Text style={styles.errorText}>{vitaminB6Error}</Text> : null}
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
                {vitaminB12Error ? <Text style={styles.errorText}>{vitaminB12Error}</Text> : null}
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
                {vitaminCError ? <Text style={styles.errorText}>{vitaminCError}</Text> : null}
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
                {vitaminDError ? <Text style={styles.errorText}>{vitaminDError}</Text> : null}
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
                {vitaminEError ? <Text style={styles.errorText}>{vitaminEError}</Text> : null}
                <TextInput
                    style={[styles.input, { backgroundColor : colors.white}]}
                    placeholder="VitaminK % (optional) max 300"
                    value={vitaminK}
                    onChangeText={setVitaminK}
                    keyboardType="numeric"
                    returnKeyType="done"
                    ref={vitaminKRef}
                />
                {vitaminKError ? <Text style={styles.errorText}>{vitaminKError}</Text> : null}
                
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
            </>
            )}
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
        borderRadius: 10,
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