import { useTheme } from "@/hooks/ThemeProvider";
import { useRiveSelections } from "@/hooks/useRiveSelections";
import { RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    Animated,
} from "react-native";
import { useSelector } from "react-redux";
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
    requiredLevel?: number;
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
        { id: "4", source: require("../../assets/avatar/hat/hat3.png"), value: 3, requiredLevel: 10 },
        { id: "5", source: require("../../assets/avatar/hat/hat4.png"), value: 4, requiredLevel: 10 },
        { id: "6", source: require("../../assets/avatar/hat/hat5.png"), value: 5, requiredLevel: 10 },
        { id: "7", source: require("../../assets/avatar/hat/hat6.png"), value: 6, requiredLevel: 10 },
        { id: "8", source: require("../../assets/avatar/hat/hat7.png"), value: 7, requiredLevel: 10 },
        { id: "9", source: require("../../assets/avatar/hat/hat8.png"), value: 8, requiredLevel: 10 },
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
    const { colors } = useTheme();
    // const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string | null }>({});
    const riveRef = React.useRef<RiveRef>(null);
    const userLevel = useSelector((state: RootState) => state.user.user?.level ?? 0);
    console.log("User level:", userLevel);
    //@ts-ignore
    const { selectedOptions, setSelectedOptions, riveReady } = useRiveSelections(
        riveRef,
        categoryOptions,
        riveMappings
    );

    //dynamic size
    const screenWidth = Dimensions.get('window').width;
    const numColumns = 3;
    const spacing = 15;
    const itemSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;
    console.log("Item size:", screenWidth);

    // code tomporary for rive
    const [showRive, setShowRive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRive(true);
        }, 2300); // 300ms pour laisser le hook appliquer les options, tu peux ajuster
        return () => clearTimeout(timer);
    }, [selectedOptions]);
    
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
    //ANIMATIONS SHAKES FOR OPTIONS LOCKED

    const shakeMap = useRef({});
    const getShakeAnim = (id) => {
        //@ts-ignore
        if (!shakeMap.current[id]) {
            //@ts-ignore
            shakeMap.current[id] = new Animated.Value(0);
        }
        //@ts-ignore
        return shakeMap.current[id];
    };

    const triggerShake = (id) => {
        const shakeAnim = getShakeAnim(id);
        shakeAnim.setValue(0);

        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    };
    
    return (
        <View style={styles.container}>
            {/* --- Image principale avec fond décoratif --- */}
            <View style={[styles.avatarContainer, { backgroundColor: colors.grayPress }]}>
                <View style={styles.avatarBackground}>
                </View>
                {showRive ? (
                    <Rive
                        ref={riveRef}
                        source={require("../../assets/rive/panda_neutral (25).riv")}
                        autoplay={true}
                        style={styles.riveAnimation}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        {/* Loader, texte, ou même un espace vide */}
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </View>

            {/* --- Scroll vertical (catégories) - Position absolue à droite --- */}
            <View style={[styles.categorySidebar, , { borderBottomColor: colors.grayPress }]}>
                <ScrollView
                    horizontal={true} // 👈 active le scroll horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.categoryScrollContent]}
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
                                    style={{ width: 28, height: 28, tintColor: selectedCategory === cat.id ? 'black' : '#CBD5E1', opacity: selectedCategory === cat.id ? 1 : 0.8, }}
                                    source={cat.source}
                                />
                            </View>
                            
                            {/* Point indicateur sous l'icône */}
                            {/* {selectedCategory === cat.id && (
                                <View style={styles.categoryDot} />
                            )} */}
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
            {(categoryOptions[selectedCategory] || []).map((opt) => {
                const isLocked = (opt.requiredLevel ?? 0) > userLevel;
                const shakeAnim = getShakeAnim(opt.id);
                return (
                    <Animated.View
                        key={opt.id}
                        style={{ transform: [{ translateX: shakeAnim }] }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.optionItem,
                                selectedOptions[selectedCategory] === opt.id && styles.optionItemSelected,
                                {
                                    backgroundColor: '#FFFFFF',
                                    height: opt.color ? 60 : itemSize,
                                    width: opt.color ? 60 : itemSize,
                                    elevation: selectedCategory === 'color' ? 0 : 2,
                                    margin: spacing / 2,
                                },
                                isLocked && { opacity: 0.4 }
                            ]}
                            activeOpacity={isLocked ? 1 : 0.5}
                            onPress={() => {
                                if (isLocked) {
                                    triggerShake(opt.id);   // 👈 maintenant c’est INDIVIDUEL
                                    return;
                                }

                                // ton comportement normal
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
                                }
                            }}
                        >
                            {/* contenu */}
                            {selectedCategory !== "color" ? (
                                <Image source={opt.source} style={styles.optionImage} resizeMode="contain" />
                            ) : (
                                <View style={[styles.itemColor, { backgroundColor: opt.color }]} />
                            )}

                            {/* Badge lvl */}
                            {isLocked && (
                                <View style={styles.levelBadge}>
                                    <Text style={styles.levelBadgeText}>lvl {opt.requiredLevel}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

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
    },
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        height: 320,
        position: "relative",
        overflow: 'hidden',
    },
    avatarBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    riveAnimation: {
        width: 360,
        height: 360,
        marginTop: 120,
        zIndex: 10,
    },
    categorySidebar: {
        borderBottomWidth: 2,
        height: 60,
        maxHeight: 60,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    categoryScrollContent: {
        alignItems: "center",
        flexDirection: "row",
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
        marginTop: 20,
    },
    optionScrollContent: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingBottom: 40,
        justifyContent: "center",
    },
    optionItem: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        marginTop: 3,
        padding: 8,
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    optionItemSelected: {
        borderColor: "#4E8DF5",
        borderWidth: 3,
        backgroundColor: "#F0F7FF",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        transform: [{ scale: 1.08 }],
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
    itemColor: {height: "80%", width: "80%", borderRadius: 15},
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
    levelBadge: {
        position: "absolute",
        bottom: 6,
        right: 6,
        backgroundColor: "#1E293B",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    levelBadgeText: {
        color: "white",
        fontWeight: "700",
        fontSize: 11,
    },
});