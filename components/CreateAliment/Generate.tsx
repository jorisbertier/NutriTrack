import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import NutritionBox from "../NutritionBox";
import { repertoryFood } from '@/data/createAliment/repertoryFood';
import { useState } from "react";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";

function Generate() {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const [inputValue, setInputValue] = useState('');
    const [inputValueGram, setInputValueGram] = useState("");
    const [foodRepertorySelected, setFoodRepertorySelected] = useState('');
    const [repertoryOpened, setRepertoryOpened] = useState(false);
    const [generateFood, setGenerateFood] = useState<any>(null);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isQuantityFocused, setIsQuantityFocused] = useState(false);

    const filteredRepertoryFood = repertoryFood.filter((food: any) => {
        return food.name.toLowerCase().includes(inputValue.toLowerCase())
    })

        // console.log(inputValue)
        // console.log(foodRepertorySelected)

    const [nutritionValues, setNutritionValues] = useState({
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
    });
    
    const handleGenerateAliment = () => {
        const food = repertoryFood.find(f => f.name.toLowerCase() === foodRepertorySelected.toLowerCase());
        if (food) {
            setGenerateFood(food);
            setNutritionValues({
            calories: (food.calories * Number(inputValueGram || 0)).toFixed(2),
            proteins: (food.proteins * Number(inputValueGram || 0)).toFixed(2),
            fats: (food.fats * Number(inputValueGram || 0)).toFixed(2),
            carbohydrates: (food.carbohydrates * Number(inputValueGram || 0)).toFixed(2),
            });
        }
    };
    
    // Met à jour une valeur particulière
    const handleValueChange = (key, newValue) => {
        setNutritionValues(prev => ({
            ...prev,
            [key]: newValue,
        }));
    };
    
    const isDisabled = 
        !foodRepertorySelected ||
        isNaN(Number(inputValueGram)) ||
        Number(inputValueGram) < 10 ||
        Number(inputValueGram) > 250;
    

    return (
        <View style={{marginBottom: 80}}>
            <Text style={{fontSize: 24, fontWeight: 500, margin: 'auto', marginBottom: 10}}>Switch Mode</Text>
            <Text style={{fontSize: 16, width: '100%', textAlign: 'center'}}>Create a food item based on the official data. Enter a quantity, and you can modify the nutritional values as needed.</Text>
            <Text style={[styles.label, { color: colors.black }]}>Name</Text>
            <View style={{position: 'relative'}}>
                <TextInput
                    value={inputValue}
                            onChangeText={(text) => {
                            setInputValue(text);
                            setRepertoryOpened(text.length > 0);
                        }}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                    style={[styles.input, { borderColor: isNameFocused ? colors.blackFix : colors.grayPress, borderRadius: 10 }]}
                />
                {repertoryOpened && filteredRepertoryFood.length > 0 && (
                <ScrollView style={styles.containerSearch}>
                    {filteredRepertoryFood.map((food: any, index : number) => (
                    <TouchableOpacity
                        key={`${food.name}-${index}`}
                        style={[styles.boxSearch, { borderColor: colors.grayDarkFix}]}
                        onPress={() => {
                            setFoodRepertorySelected(food.name);
                            setInputValue(food.name);
                            setRepertoryOpened(false);
                        }}
                    >
                        <Text style={[styles.label, { color: colors.black }]}>{food.name}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            </View>
            {foodRepertorySelected && (<View style={{marginTop: 10,backgroundColor: colors.white, width: "30%", justifyContent: 'center', paddingLeft: 5, borderColor: colors.black, borderWidth: 1, padding: 2, height: 30, borderRadius: 10}}><Text style={[{fontWeight: 500, color: "black" }]}>{foodRepertorySelected}</Text></View>)}
            <Text style={[styles.label, { color: colors.black }]}>Quantity between 10 & 250 g</Text>
            <TextInput
                value={inputValueGram}
                onChangeText={(text) => setInputValueGram(text)}
                keyboardType="numeric"
                onFocus={() => setIsQuantityFocused(true)}
                onBlur={() => setIsQuantityFocused(false)}
                style={[styles.input, { borderColor: isQuantityFocused ? colors.blackFix : colors.grayPress, borderRadius: 10 }]}
            ></TextInput>
            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                <TouchableOpacity
                    onPress={isDisabled ? null : handleGenerateAliment}  // bloque le clic si disabled
                    style={{
                        backgroundColor: isDisabled ? 'gray' : colors.black,
                        height: 50,
                        width: '90%',
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 30,
                        opacity: isDisabled ? 0.6 : 1, // optionnel, pour montrer visuellement
                    }}
                    activeOpacity={isDisabled ? 1 : 0.7} // désactive l'effet d'opacité si désactivé
                    >
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>Generate an aliment</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20}}>
                {generateFood?.calories !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/burn.png')}
                    label={t('calories')}
                    value={generateFood.calories}
                    onChangeValue={(val) => handleValueChange('calories', val)}
                    inputValueGram={inputValueGram}
                    />
                )}

                {generateFood?.proteins !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/protein.png')}
                    label={t('proteins')}
                    value={generateFood.proteins}
                    onChangeValue={(val) => handleValueChange('proteins', val)}
                    inputValueGram={inputValueGram}
                    />
                )}

                {generateFood?.carbohydrates !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/carbs.png')}
                    label={t('carbs')}
                    value={generateFood.carbohydrates}
                    onChangeValue={(val) => handleValueChange('carbs', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.fats !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('fats')}
                    value={generateFood.fats}
                    onChangeValue={(val) => handleValueChange('fats', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.potassium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('potassium')}
                    value={generateFood.potassium}
                    onChangeValue={(val) => handleValueChange('potassium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.magnesium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('magnesium')}
                    value={generateFood.magnesium}
                    onChangeValue={(val) => handleValueChange('magnesium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.calcium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('calcium')}
                    value={generateFood.calcium}
                    onChangeValue={(val) => handleValueChange('calcium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.iron !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('iron')}
                    value={generateFood.iron}
                    onChangeValue={(val) => handleValueChange('iron', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminA !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminA')}
                    value={generateFood.vitaminA}
                    onChangeValue={(val) => handleValueChange('vitaminA', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB1 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminB1')}
                    value={generateFood.vitaminB1}
                    onChangeValue={(val) => handleValueChange('vitaminB1', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB6 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminB6')}
                    value={generateFood.vitaminB6}
                    onChangeValue={(val) => handleValueChange('vitaminB6', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB12 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminB12')}
                    value={generateFood.vitaminB12}
                    onChangeValue={(val) => handleValueChange('vitaminB12', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminC !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminC')}
                    value={generateFood.vitaminC}
                    onChangeValue={(val) => handleValueChange('vitaminC', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminD !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminD')}
                    value={generateFood.vitaminD}
                    onChangeValue={(val) => handleValueChange('vitaminD', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminE !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminE')}
                    value={generateFood.vitaminE}
                    onChangeValue={(val) => handleValueChange('vitaminE', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminK !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('vitaminK')}
                    value={generateFood.vitaminK}
                    onChangeValue={(val) => handleValueChange('vitaminK', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.folate !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/fat.png')}
                    label={t('folate')}
                    value={generateFood.folate}
                    onChangeValue={(val) => handleValueChange('folate', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        containerSearch : {
        maxHeight: 250,
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        margin: 0,
        position: 'absolute',
        top: 55,
        width: '100%',
        zIndex: 10
    },
    boxSearch: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        padding: 2,
        margin: 0,
        gap: 0,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        paddingLeft: 10
        
    }
})

export default Generate;