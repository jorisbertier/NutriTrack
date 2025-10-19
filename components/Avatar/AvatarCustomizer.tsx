import { useRiveSelections } from "@/hooks/useRiveSelections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import Rive, { RiveRef } from "rive-react-native";

const { width } = Dimensions.get("window");

type Category = {
    id: string;
    label: string;
};

type Option = {
    id: string;
    image?: string;
    color?: string; 
    value?: number; 
};

const categories: Category[] = [
    { id: "color", label: "Couleur" },
    { id: "hat", label: "Chapeau" },
];

const categoryOptions: Record<string, Option[]> = {
    color: [
        { id: "1", color: "#000", value: 0 }, 
        { id: "2", color: "#C258CA", value: 1 },
        { id: "3", color: "#73D2DE", value: 2 },
        { id: "4", color: "#68FF26", value: 3 },
        { id: "5", color: "#1C29D4", value: 4 },
    ],
    hat: [
        { id: "1", image: "https://via.placeholder.com/80/f1c40f", value: 0 },
        { id: "2", image: "https://via.placeholder.com/80/8e44ad", value: 1 },
        { id: "3", image: "https://via.placeholder.com/80/2ecc71", value: 2 },
    ],
};

const riveMappings: Record<string, { machine: string; input: string }> = {
    color: { machine: "StateMachineChangeEyesColor", input: "EyeColor" },
    hat: { machine: "StateMachineChangeEyesColor", input: "HatType" },
};

export const AvatarCustomizer = () => {
    const [selectedCategory, setSelectedCategory] = useState("glasses");
    // const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string | null }>({});
    const riveRef = React.useRef<RiveRef>(null);
    const { selectedOptions, setSelectedOptions, riveReady } = useRiveSelections(
        riveRef,
        categoryOptions,
        riveMappings
    );
    
    console.log('selectedOption', selectedOptions);

    //     if (riveRef.current) {
    // exemple d’API hypothétique : setInputState(stateMachineName, inputName, value)
    //@ts-ignore
    //   riveRef.current.setInputState("MyStateMachine", inputName, value);
    // }
    // const test = riveRef.current?.setInputState("MyStateMachine", "EyeColor", 2);
    const handlePlay = () => { riveRef.current?.play() };
    const [colorIndex, setColorIndex] = useState(0);
    
    // const handleChangeColor = () => {
    
    //     // Cycle entre 0 → 1 → 2 → 0
    //     const nextColor = (colorIndex + 1) % 5;
    
    //     // Change l’input "EyeColor" dans la state machine
    //     riveRef.current?.setInputState("StateMachineChangeEyesColor", "EyeColor", nextColor);
    //     console.log("🎨 set EyeColor =", nextColor, riveRef.current);
    
    //     // Met à jour l’état React
    //     setColorIndex(nextColor);
    
    //     console.log("👁 Couleur changée :", nextColor);
    // };
    
    // const handleCategorySelect = (catId: string) => {
    //     setSelectedCategory(catId);
    //     setSelectedOption(null); // Reset selection
    // };

    console.log("selectedOption", selectedOptions);

    // SAVE SELECTION

    const saveSelection = async (inputName: string, value: number) => {
        try {
            await AsyncStorage.setItem(inputName, value.toString());
            console.log(`✅ Saved ${inputName} = ${value}`);
        } catch (e) {
            console.error("Error saving selection", e);
        }
    };

    //     const [riveReady, setRiveReady] = useState(false);

// useEffect(() => {
//   if (riveRef.current) setRiveReady(true);
// }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         const restoreSelections = async () => {
    //         try {
    //             const savedEyeColor = await AsyncStorage.getItem("EyeColor");
    //             const savedHat = await AsyncStorage.getItem("HatType");

    //             setSelectedOptions({
    //             color: savedEyeColor ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor))?.id || null : null,
    //             hat: savedHat ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat))?.id || null : null,
    //             });
    //         } catch (e) {
    //             console.error("Error restoring selections", e);
    //         }
    //         };

    //         restoreSelections();
    //     }, [])
    // );
    // useEffect(() => {
    //     if (!riveReady) return;

    //     if (selectedOptions.color) {
    //         const value = categoryOptions.color.find(opt => opt.id === selectedOptions.color)?.value;
    //         if (value !== undefined) {
    //         riveRef.current?.setInputState("StateMachineChangeEyesColor", "EyeColor", value);
    //         }
    //     }

    //     if (selectedOptions.hat) {
    //         const value = categoryOptions.hat.find(opt => opt.id === selectedOptions.hat)?.value;
    //         if (value !== undefined) {
    //         riveRef.current?.setInputState("StateMachineChangeEyesColor", "HatType", value);
    //         }
    //     }
    // }, [riveReady, selectedOptions]);
    console.log('rive reday' , riveReady)
    return (
        <View style={styles.container}>
        {/* --- Image principale --- */}
        <View style={styles.avatarContainer}>
            {/* <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.avatarImage}
            /> */}
            <Rive
            ref={riveRef}
            source={require("../../assets/rive/panda_neutral (22).riv")}
            autoplay={true}
            style={{ width: 300, height: 320, marginTop: 70 }}
            />
        </View>
        {/* <TouchableOpacity style={{padding: 20, backgroundColor: 'red'}} onPress={handleChangeColor}>
            <Text >Changer la couleur des yeux</Text>
        </TouchableOpacity> */}

        {/* --- Scroll horizontal (catégories) --- */}
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
        >
            {categories.map((cat) => (
            <TouchableOpacity
                key={cat.id}
                style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
            >
                <Text
                style={[
                    styles.categoryText,
                    selectedCategory === cat.id && styles.categoryTextSelected,
                ]}
                >
                {cat.label}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>

        {/* --- Scroll vertical (options à choisir) --- */}
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.optionScroll}
            contentContainerStyle={styles.optionScrollContent}
            >
            {(categoryOptions[selectedCategory] || []).map((opt) => (
                <TouchableOpacity
                key={opt.id}
                style={[
                    styles.optionItem,
                    selectedOptions[selectedCategory] === opt.id && styles.optionItemSelected,
                    , {backgroundColor: opt.color ? opt.color : '#FFF'}
                ]}
                onPress={() => {
                  setSelectedOptions(prev => ({ ...prev, [selectedCategory]: opt.id }));
                setColorIndex(Number(opt.value));

                const mapping = riveMappings[selectedCategory];
                if (mapping && riveRef.current) {
                    riveRef.current.setInputState(
                    mapping.machine,
                    mapping.input,
                    Number(opt.value)
                    );
                    saveSelection(mapping.input, Number(opt.value));
                    console.log(`🎨 ${mapping.input} changé =`, opt.value);
                } else {
                    console.warn("⚠️ Aucun mapping trouvé pour", selectedCategory);
                }
                }}
                >
                <Image source={{ uri: opt.image }} style={styles.optionImage} />
                </TouchableOpacity>
            ))}

            {/* Message si aucune option */}
            {categoryOptions[selectedCategory]?.length === 0 && (
                <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
                Aucune option disponible pour cette catégorie
                </Text>
            )}
            </ScrollView>
        </View>
    );
};

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        alignItems: "center",
        paddingTop: 20,
    },
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
    },
    avatarImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#E0E0E0",
    },
    categoryScroll: {
        marginTop: 10,
        maxHeight: 60,
    },
    categoryScrollContent: {
        paddingHorizontal: 10,
        alignItems: "center",
    },
    categoryButton: {
        backgroundColor: "#EEE",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 6,
    },
    categoryButtonSelected: {
        backgroundColor: "#4E8DF5",
    },
    categoryText: {
        color: "#555",
        fontWeight: "500",
    },
    categoryTextSelected: {
        color: "#FFF",
    },
    optionScroll: {
        marginTop: 20,
        width: width * 0.9,
    },
    optionScrollContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingBottom: 40,
    },
    optionItem: {
        width: 80,
        height: 80,
        marginVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
    },
    optionItemSelected: {
        borderColor: "#4E8DF5",
        borderWidth: 2,
    },
    optionImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
});
