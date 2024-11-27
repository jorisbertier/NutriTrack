import { ThemedText } from '@/components/ThemedText';
import { fetchUserIdDataConnected } from '@/functions/function';
import { useTheme } from '@/hooks/ThemeProvider'
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { doc, setDoc } from "firebase/firestore"; 
import { firestore } from '@/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

function CreateAliment() {

    const {colors} = useTheme();

    /*Get id user*/
    const [userIdConnected, setUserIdConnected] = useState<number>();
    const auth = getAuth();
    const user = auth.currentUser;

    const [title, setTitle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [calories, setCalories] = useState('');
    const [proteins, setProteins] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');

    /**ERROR MESSAGE */
    const [titleError, setTitleError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [unitError, setUnitError] = useState('');
    const [caloriesError, setCaloriesError] = useState('');
    const [proteinsError, setProteinsError] = useState('');
    const [carbsError, setCarbsError] = useState('');
    const [fatsError, setFatsError] = useState('');
    /**ERROR MESSAGE */

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

    console.log('get id', userIdConnected)

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
            await setDoc(doc(firestore, "UserCreatedFoods",  generateManualId()), {
                title: title,
                quantity: Number(quantity),
                unit: unit,
                calories: Number(calories),
                proteins: Number(proteins),
                carbs: Number(carbs),
                fats: Number(fats),
                idUser: Number(userIdConnected)
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
                    placeholder="Name"
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize='words'
                />
                {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Quantity -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Quantity"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                />
                {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Unit /g, ml, cup, slice -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Unit"
                    value={unit}
                    onChangeText={setUnit}
                    autoCapitalize='words'
                />
                <ThemedText style={[{color : colors.black, marginBottom: 10}]}>* The unit must only contain g / cl / ml / l / cup</ThemedText>
                {unitError ? <Text style={styles.errorText}>{unitError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Calories -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Calories"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                />
                {caloriesError ? <Text style={styles.errorText}>{caloriesError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Proteins -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Proteins"
                    value={proteins}
                    onChangeText={setProteins}
                    keyboardType="numeric"
                />
                {proteinsError ? <Text style={styles.errorText}>{proteinsError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Carbohydrates -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Carbohydrates"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                />
                {carbsError ? <Text style={styles.errorText}>{carbsError}</Text> : null}
                <Text style={[styles.label, {color : colors.black}]}>Fats -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Fats"
                    value={fats}
                    onChangeText={setFats}
                    keyboardType="numeric"
                />
                {fatsError ? <Text style={styles.errorText}>{fatsError}</Text> : null}
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
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    label: {
        marginTop: 16,
        marginBottom: 8,
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