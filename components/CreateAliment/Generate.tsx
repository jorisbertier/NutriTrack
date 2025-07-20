import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import NutritionBox from "../NutritionBox";
import { repertoryFood } from '@/data/createAliment/repertoryFood';
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/ThemeProvider";
import { useTranslation } from "react-i18next";
import { FoodItemGenerate } from "@/interface/FoodItemGenerate";
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { firestore, getAuth } from '@/firebaseConfig';
import { User } from "@/interface/User";
import { fetchUserDataConnected } from "@/functions/function";

function Generate() {

    const { colors } = useTheme();
    const { t } = useTranslation();

    const [userData, setUserData] = useState<User[]>([])
    const auth = getAuth();
    const user = auth.currentUser;

    const [inputValue, setInputValue] = useState('');
    const [title, setTitle] = useState('');
    const [isTitleFocused, setIsTitleFocused] = useState(false);
    const [inputValueGram, setInputValueGram] = useState("");
    const [foodRepertorySelected, setFoodRepertorySelected] = useState('');
    const [repertoryOpened, setRepertoryOpened] = useState(false);
    const [generateFood, setGenerateFood] = useState<any>(null);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isQuantityFocused, setIsQuantityFocused] = useState(false);

    const [ errorMessageTitle, setErrorMessageTitle] = useState('');

    const inputInModalRef = useRef(null);

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

    const filteredRepertoryFood = repertoryFood.filter((food: any) => {
        return food.name.toLowerCase().includes(inputValue.toLowerCase())
    })

    const [nutritionValues, setNutritionValues] = useState({
        calories: 0,proteins: 0,carbohydrates: 0,fats: 0,magnesium: 0,potassium: 0,calcium: 0,sodium: 0,iron: 0,folate: 0,vitaminA: 0,vitaminB1: 0,vitaminB6: 0,vitaminB12: 0,vitaminC: 0,vitaminD: 0,vitaminE: 0,vitaminK: 0,cholesterol: 0,sugar: 0
    });
    
    const handleGenerateAliment = () => {
        const food : FoodItemGenerate | undefined = repertoryFood.find(f => f.name.toLowerCase() === foodRepertorySelected.toLowerCase());
        if (food) {
            setGenerateFood(food);
            setNutritionValues({
                calories:  Number((food.calories * Number(inputValueGram || 0)).toFixed(2)),
                proteins: Number((food.proteins * Number(inputValueGram || 0)).toFixed(2)),
                fats: Number((food.fats * Number(inputValueGram || 0)).toFixed(2)),
                carbohydrates: Number((food.carbohydrates * Number(inputValueGram || 0)).toFixed(2)),
                magnesium: Number(((food.magnesium ?? 0)* Number(inputValueGram || 0)).toFixed(2)),
                potassium:  Number(((food.potassium ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                calcium: Number(((food.calcium ?? 0) * Number(inputValueGram || 0)).toFixed(2)),
                sodium: Number(((food.sodium ?? 0) * Number(inputValueGram || 0)).toFixed(2)),
                iron: Number(((food.iron ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                folate: Number(((food.folate ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminA: Number(((food?.vitaminA ?? 0) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminB1: Number(((food.vitaminB1 ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminB6: Number(((food.vitaminB6 ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminB12: Number(((food.vitaminB12 ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminC: Number(((food.vitaminC ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminD: Number(((food.vitaminD ?? 0 ) *  Number(inputValueGram || 0)).toFixed(2)),
                vitaminE: Number(((food.vitaminE ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
                vitaminK: ((food.vitaminK ?? 0 ) * Number(inputValueGram || 0)).toFixed(2),
                sugar: Number(((food.sugar ?? 0 ) * Number(inputValueGram || 0)).toFixed(2)),
            });
        }
    };
    
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

    const generateManualId = () => {
        return `ID-${Date.now()}`;
    }


    const handleCreateAliment = async (event: any) => {
        event.preventDefault();
        if (title.trim() === '' && typeof title === 'string' && title.length < 3 ) {
            setErrorMessageTitle("The title must contain only letters and be at least 3 characters long.");
            return;
        }
        setErrorMessageTitle('');
        console.log(nutritionValues)
        const filteredNutritionValues = Object.fromEntries(
            Object.entries(nutritionValues).filter(([key, value]) => {
                return Number(value) !== 0;
            })
        );
        console.log('sort', filteredNutritionValues)
        console.log('title', title)
        console.log('inputValueGram', inputValueGram)
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
                magnesium: Number(filteredNutritionValues.magnesium) || null,
                potassium: Number(filteredNutritionValues.potassium) || null,
                calcium: Number(filteredNutritionValues.calcium) || null,
                sodium: Number(filteredNutritionValues.sodium) || null,
                iron: Number(filteredNutritionValues.iron) || null,
                vitaminA: Number(filteredNutritionValues.vitaminA) || null,
                vitaminB1: Number(filteredNutritionValues.vitaminB1) || null,
                vitaminB5: Number(filteredNutritionValues.vitaminB5) || null,
                vitaminB6: Number(filteredNutritionValues.vitaminB6) || null,
                vitaminB12: Number(filteredNutritionValues.vitaminB12) || null,
                vitaminC: Number(filteredNutritionValues.vitaminC) || null,
                vitaminD: Number(filteredNutritionValues.vitaminD) || null,
                vitaminE: Number(filteredNutritionValues.vitaminE) || null,
                vitaminK: Number(filteredNutritionValues.vitaminK) || null,
                folate: Number(filteredNutritionValues.folate) || null,
                sugar: Number(filteredNutritionValues.sugar) || null,
            };
            
            Object.keys(dataToSave).forEach((key) => {
                if (dataToSave[key] === null || dataToSave[key] === undefined || dataToSave[key] === '') {
                    delete dataToSave[key];
                }
            });
            console.log('data save :', dataToSave)

            await setDoc(doc(firestore, "UserCreatedFoods",  generateManualId()), {
                id: newId,
                title: title,
                quantity: Number(inputValueGram),
                calories: Number(filteredNutritionValues.calories),
                proteins: Number(filteredNutritionValues.proteins),
                carbohydrates: Number(filteredNutritionValues.carbohydrates),
                fats: Number(filteredNutritionValues.fats),
                idUser: userData[0]?.id,
                ...dataToSave
            });
            Alert.alert('Aliment created')
    //         resetForm()
        } catch(error: any) {
            Alert.alert('Create an aliment error', error.message)
        }

            
    }
    const [modalVisible, setModalVisible] = useState(false);
    
    const handleClose = () => {
        setModalVisible(false);
    };


    return (
        <View style={{marginBottom: 80}}>
            <Text style={{fontSize: 16, width: '100%', textAlign: 'center'}}>Create a food item based on the official data. Enter a quantity, and you can modify the nutritional values as needed.</Text>
            <Text style={[styles.label, { color: colors.black }]}>Name</Text>
            <View style={{position: 'relative'}}>
                <TextInput
                    value={inputValue}
                            onChangeText={(text) => {
                            setInputValue(text);
                            setRepertoryOpened(text.length > 0);
                            setModalVisible(true);
                        }}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                    style={[styles.input, { borderColor: isNameFocused ? colors.blackFix : colors.grayPress }]}
                />
                {filteredRepertoryFood.length === 0 && (<Text style={styles.errorMessage}>There is no food matching with {inputValue}.</Text>)}

                {repertoryOpened && filteredRepertoryFood.length > 0 && (
                    <Modal transparent={true} visible={modalVisible} animationType="slide" onShow={() => {
                        if (inputInModalRef.current) {
                        inputInModalRef.current.focus();
                        }
                    }}>
                        <TouchableWithoutFeedback onPress={handleClose}>
                            <View style={modal.modalContainer}>
                                <View style={[styles.searchBox, {backgroundColor: colors.white}]}>
                                    <TextInput
                                        ref={inputInModalRef} 
                                        value={inputValue}
                                                onChangeText={(text) => {
                                                setInputValue(text);
                                                setRepertoryOpened(text.length > 0);
                                                setModalVisible(true);
                                            }}
                                    onFocus={() => setIsNameFocused(true)}
                                    onBlur={() => setIsNameFocused(false)}
                                    style={[styles.input2, {backgroundColor: 'white', borderColor: isNameFocused ? colors.blackFix : colors.grayPress }]}
                                    />
                                </View>
                            <ScrollView style={styles.containerSearch} persistentScrollbar={true}>
                            {filteredRepertoryFood.map((food: any, index : number) => {
                                const isLast = index == filteredRepertoryFood.length - 1;
                                return (
                                    <TouchableOpacity
                                            key={`${food.name}-${index}`}
                                            style={[
                                                styles.boxSearch,
                                                isLast ? {
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                    borderTopColor: colors.grayPress,
                                                    borderTopWidth: 1,
                                                } : {
                                                    borderTopColor: colors.grayPress,
                                                    borderTopWidth: 1,
                                                },
                                            ]}
                                            onPress={() => {
                                                setFoodRepertorySelected(food.name);
                                                setInputValue(food.name);
                                                setRepertoryOpened(false);
                                                setModalVisible(false)
                                            }}
                                        >
                                            <Text style={[styles.label, { color: colors.black }]}>{food.name}</Text>
                                    </TouchableOpacity>
                                )})}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                    </Modal>
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
                style={[styles.input, { borderColor: isQuantityFocused ? colors.blackFix : colors.grayPress}]}
            ></TextInput>
            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                <TouchableOpacity
                    onPress={isDisabled ? null : handleGenerateAliment} 
                    style={[styles.button, {
                        backgroundColor: isDisabled ? 'gray' : colors.black,
                        opacity: isDisabled ? 0.6 : 1,
                    }]}
                    activeOpacity={isDisabled ? 1 : 0.7}
                    >
                    <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>Generate an aliment</Text>
                </TouchableOpacity>
            </View>
                {generateFood?.calories !== undefined && (
                <View style={{marginTop: 10, width: '100%', alignSelf: 'center'}}>
                    <Text style={[styles.label, { color: colors.blackFix }]}>Title</Text>
                    <TextInput
                        onFocus={() => setIsTitleFocused(true)}
                        onBlur={() => setIsTitleFocused(false)}
                        style={[styles.input, { borderColor: isTitleFocused ? colors.blackFix : colors.grayPress}]}
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize='words'
                    />
                </View>
                )}
                {errorMessageTitle && (
                    <Text style={styles.errorMessage}>{errorMessageTitle}</Text>
                )}
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20}}>
                {generateFood?.calories !== undefined && (
                    <>
                        <NutritionBox
                        icon={require('@/assets/images/nutritional/burn.png')}
                        label={t('calories')}
                        value={generateFood.calories}
                        onChangeValue={(val) => handleValueChange('calories', val)}
                        inputValueGram={inputValueGram}
                        />
                    </>
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
                    onChangeValue={(val) => handleValueChange('carbohydrates', val)}
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
                    icon={require('@/assets/images/nutritional/ions.png')}
                    label={t('potassium')}
                    value={generateFood.potassium}
                    onChangeValue={(val) => handleValueChange('potassium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.magnesium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/ions.png')}
                    label={t('magnesium')}
                    value={generateFood.magnesium}
                    onChangeValue={(val) => handleValueChange('magnesium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.sodium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/ions.png')}
                    label={t('sodium')}
                    value={generateFood.sodium}
                    onChangeValue={(val) => handleValueChange('sodium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.calcium !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/calcium.png')}
                    label={t('calcium')}
                    value={generateFood.calcium}
                    onChangeValue={(val) => handleValueChange('calcium', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.iron !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/strenght.png')}
                    label={t('iron')}
                    value={generateFood.iron}
                    onChangeValue={(val) => handleValueChange('iron', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminA !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminA') + " %"}
                    value={generateFood.vitaminA}
                    onChangeValue={(val) => handleValueChange('vitaminA', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB1 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminB1') + " %"}
                    value={generateFood.vitaminB1}
                    onChangeValue={(val) => handleValueChange('vitaminB1', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB6 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminB6') + " %"}
                    value={generateFood.vitaminB6}
                    onChangeValue={(val) => handleValueChange('vitaminB6', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminB12 !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminB12') + " %"}
                    value={generateFood.vitaminB12}
                    onChangeValue={(val) => handleValueChange('vitaminB12', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminC !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminC') + " %"}
                    value={generateFood.vitaminC}
                    onChangeValue={(val) => handleValueChange('vitaminC', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminD !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminD') + " %"}
                    value={generateFood.vitaminD}
                    onChangeValue={(val) => handleValueChange('vitaminD', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminE !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminE') + " %"}
                    value={generateFood.vitaminE}
                    onChangeValue={(val) => handleValueChange('vitaminE', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.vitaminK !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/vitamin.png')}
                    label={t('vitaminK') + " %"}
                    value={generateFood.vitaminK}
                    onChangeValue={(val) => handleValueChange('vitaminK', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.folate !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/folate.png')}
                    label={t('folate')}
                    value={generateFood.folate}
                    onChangeValue={(val) => handleValueChange('folate', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.sugar !== undefined && (
                    <NutritionBox
                    icon={require('@/assets/images/nutritional/sugar.png')}
                    label={t('sugar')}
                    value={generateFood.sugar}
                    onChangeValue={(val) => handleValueChange('sugar', val)}
                    inputValueGram={inputValueGram}
                    />
                )}
                {generateFood?.calories !== undefined && (
                    <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                        <TouchableOpacity
                            onPress={handleCreateAliment} 
                            style={[styles.button , { backgroundColor: colors.black, borderWidth: 1}]}
                            >
                            <Text style={{color: colors.white, fontSize: 16, fontWeight: 500}}>Create an aliment</Text>
                        </TouchableOpacity>
                    </View>
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
        borderRadius: 10,
        marginBottom: 3,
        paddingHorizontal: 10,
    },
    searchBox : {
        width: '90%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    input2: {
        height: 50,
        width: '90%',
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
    containerSearch : {
        maxHeight: 250,
        overflow: 'hidden',
        borderColor: 'black',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        margin: 0,
        width: '90%',
        zIndex: 10
    },
    boxSearch: {
        backgroundColor: 'white',
        padding: 2,
        margin: 0,
        gap: 0,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        paddingLeft: 10
    },
    button: {
        height: 50,
        width: '90%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    errorMessage : {
        color: 'red',
        marginTop: 10
    }
})


const modal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default Generate;