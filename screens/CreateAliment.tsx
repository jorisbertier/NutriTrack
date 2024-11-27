import { useTheme } from '@/hooks/ThemeProvider'
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

function CreateAliment() {

    const {colors} = useTheme();

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
        return isValid;
    }


    const createAliment = (event: any) => {
        event.preventDefault();
        if(!validateFields()) {
            return;
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
                <Text style={[styles.label, {color : colors.black}]}>Unit /g, ml, cup, slice -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Unit"
                    value={unit}
                    onChangeText={setUnit}
                    autoCapitalize='words'
                />
                <Text style={[styles.label, {color : colors.black}]}>Calories -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Calories"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                />
                <Text style={[styles.label, {color : colors.black}]}>Proteins -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Proteins"
                    value={proteins}
                    onChangeText={setProteins}
                    keyboardType="numeric"
                />
                <Text style={[styles.label, {color : colors.black}]}>Carbohydrates -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Carbohydrates"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                />
                <Text style={[styles.label, {color : colors.black}]}>Fats -</Text>
                <TextInput
                    style={[styles.input, { backgroundColor : colors.grayPress}]}
                    placeholder="Fats"
                    value={fats}
                    onChangeText={setFats}
                    keyboardType="numeric"
                />
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