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
    ImageSourcePropType,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import Rive, { RiveRef } from "rive-react-native";

const { width } = Dimensions.get("window");
type Category = {
    id: string;
    label: string;
    source: ImageSourcePropType;
};

type Option = {
    id: string;
    source?: ImageSourcePropType;
    color?: string; 
    value?: number; 
};

const categories: Category[] = [
    { id: "color", label: "Couleur", source: require("../../assets/avatar/category/color.png")},
    { id: "hat", label: "Chapeau", source: require("../../assets/avatar/category/hat.png") },
    { id: "eyes", label: "Eyes", source: require("../../assets/avatar/category/eyes.png") },
    { id: "mouth", label: "Mouth", source: require("../../assets/avatar/category/mouth.png") },
];

const categoryOptions: Record<string, Option[]> = {
    color: [
        { id: "1", color: "#000", value: 0 }, 
        { id: "2", color: "#00B9E8", value: 1 },
        { id: "3", color: "#1C29D4", value: 2 },
        { id: "4", color: "#73D2DE", value: 3 },
        { id: "5", color: "#99D17B", value: 4 },
        { id: "6", color: "#68FF26", value: 5 },
        { id: "7", color: "#C258CA", value: 6 },
        { id: "8", color: "#702963", value: 7 },
        { id: "9", color: "#9F8170", value: 8 },
        { id: "10", color: "#D36135", value: 9 },
        { id: "11", color: "#FFEF00", value: 10 },
    ],
    hat: [
        { id: "1", source: "", value: 0 },
        { id: "2", source: require("../../assets/avatar/hat/hat1.png"), value: 1 },
        { id: "3", source: require("../../assets/avatar/hat/hat2.png"), value: 2 },
        { id: "4", source: require("../../assets/avatar/hat/hat3.png"), value: 3 },
        { id: "5", source: require("../../assets/avatar/hat/hat4.png"), value: 4 },
        { id: "6", source: require("../../assets/avatar/hat/hat5.png"), value: 5 },
        { id: "7", source: require("../../assets/avatar/hat/hat6.png"), value: 6 },
        { id: "8", source: require("../../assets/avatar/hat/hat7.png"), value: 7 },
        { id: "9", source: require("../../assets/avatar/hat/hat8.png"), value: 8 },
        { id: "10", source: require("../../assets/avatar/hat/hat9.png"), value: 9 },
        { id: "11", source: require("../../assets/avatar/hat/hat10.png"), value: 10 },
    ],
    eyes: [
        { id: "1", source: "", value: 0 },
        { id: "2", source: require("../../assets/avatar/hat/hat1.png"), value: 1 },
        { id: "3", source: require("../../assets/avatar/hat/hat2.png"), value: 2 },
        { id: "4", source: require("../../assets/avatar/hat/hat3.png"), value: 3 },
    ],
    mouth: [
        { id: "1", source: require("../../assets/avatar/mouth/mouth_00.png"), value: 0 },
        { id: "2", source: require("../../assets/avatar/mouth/mouth_01.png"), value: 1 },
        { id: "3", source: require("../../assets/avatar/mouth/mouth_02.png"), value: 2 },
        { id: "4", source: require("../../assets/avatar/mouth/mouth_03.png"), value: 3 },
        { id: "5", source: require("../../assets/avatar/mouth/mouth_04.png"), value: 4 },
    ],
};

const riveMappings: Record<string, { machine: string; input: string }> = {
    color: { machine: "StateMachineChangeEyesColor", input: "EyeColor" },
    hat: { machine: "StateMachineChangeEyesColor", input: "HatType" },
    eyes: { machine: "StateMachineChangeEyesColor", input: "EyesType" },
    mouth: { machine: "StateMachineChangeEyesColor", input: "MouthType" },
};

export const AvatarCustomizer = () => {
    const [selectedCategory, setSelectedCategory] = useState("glasses");
    // const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string | null }>({});
    const riveRef = React.useRef<RiveRef>(null);
    //@ts-ignore
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
        {/* --- Image principale avec fond décoratif --- */}
        <View style={styles.avatarContainer}>
            <View style={styles.avatarBackground}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
            </View>
            <Rive
                ref={riveRef}
                source={require("../../assets/rive/panda_neutral (25).riv")}
                autoplay={true}
                style={styles.riveAnimation}
            />
        </View>

        {/* --- Scroll vertical (catégories) - Position absolue à droite --- */}
        <View style={styles.categorySidebar}>
            <ScrollView
                showsVerticalScrollIndicator={false}
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
                        activeOpacity={0.7}
                    >
                        {/* Icône/Logo de la catégorie */}
                        <View style={styles.categoryIconContainer}>
                            <Image
                                style={{ width: 24, height: 24, tintColor: selectedCategory === cat.id ? 'black' : '#CBD5E1', opacity: selectedCategory === cat.id ? 1 : 0.8, }}
                                source={cat.source}
                            />
                        </View>
                        
                        {/* Point indicateur sous l'icône */}
                        {selectedCategory === cat.id && (
                            <View style={styles.categoryDot} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

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
                        { backgroundColor: '#FFFFFF', height: opt.color ? 60: 100, width: opt.color ? 60 : 100},
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
                    activeOpacity={0.8}
                >
                    {selectedCategory !== "color"  ? (
                    <>
                        {selectedCategory === "mouth" ? (
                            <View style={{ overflow: 'hidden', height: 150, width: 150 }}>
                                <Image
                                    source={opt.source}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                            </View>
                        ): (
                            <Image
                                style={[styles.optionImage, selectedCategory === "mouth" ? { width: 150, height: 150, paddingTop: 50 } : { resizeMode: 'contain' }]}
                                source={opt.source}
                            />
                        )}
                        {selectedOptions[selectedCategory] === opt.id && (
                            <View style={styles.checkmarkContainer}>
                                <View style={styles.checkmark} />
                            </View>
                        )}
                    </>
                ): (
                    <View style={[styles.itemColor ,{backgroundColor: opt.color}]}></View>
                )}
                </TouchableOpacity>
            ))}

            {/* Message si aucune option */}
            {categoryOptions[selectedCategory]?.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        Aucune option disponible
                    </Text>
                </View>
            )}
        </ScrollView>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
        paddingTop: 20,
    },
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 280,
        position: "relative",
    },
    avatarBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    decorCircle1: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#E8F0FE",
        top: 20,
        left: -50,
        opacity: 0.5,
    },
    decorCircle2: {
        position: "absolute",
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#FFF4E6",
        bottom: 30,
        right: -30,
        opacity: 0.5,
    },
    riveAnimation: {
        width: 300,
        height: 320,
        marginTop: 20,
        zIndex: 10,
    },
    categorySidebar: {
        position: "absolute",
        right: 15,
        top: 40,
        height: "60%",
        maxHeight: 270,
        width: 70,
        backgroundColor: "#FFFFFF",
        borderRadius: 35,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 100,
    },
    categoryScrollContent: {
        alignItems: "center",
        paddingVertical: 5,
        gap: 18,
    },
    categoryButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    categoryButtonSelected: {
        transform: [{ scale: 1.1 }],
    },
    categoryIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
    },
    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "black",
        marginTop: 8,
    },
    optionScroll: {
        marginTop: 35,
        paddingHorizontal: 20,
    },
    optionScrollContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 40,
        gap: 12,
    },
    optionItem: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginTop: 3,
        padding: 6,
        backgroundColor: "red",
        position: "relative",
        overflow: "hidden",
    },
    optionItemSelected: {
        borderColor: "black",
        borderWidth: 2,
        shadowColor: "#4E8DF5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        transform: [{ scale: 1.05 }],
    },
    optionImage: {
        width: "60%",
        height: "60%",
        borderRadius: 12,
    },
    checkmarkContainer: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#4E8DF5",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#4E8DF5",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    checkmark: {
        width: 8,
        height: 12,
        borderBottomWidth: 2.5,
        borderRightWidth: 2.5,
        borderColor: "#FFFFFF",
        transform: [{ rotate: "45deg" }],
        marginBottom: 3,
        marginLeft: 2,
    },
    itemImage: { width: 150, height: 150, position: 'absolute', top: 20},
    itemColor: {height: "90%", width: "90%", borderRadius: 15},
    emptyState: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyStateText: {
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 15,
        fontWeight: "500",
    },
});