import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type Category = {
    id: string;
    label: string;
};

type Option = {
    id: string;
    image: string;
};

const categories: Category[] = [
    { id: "glasses", label: "Lunettes" },
    { id: "hair", label: "Cheveux" },
    { id: "beard", label: "Barbe" },
    { id: "hat", label: "Chapeau" },
    { id: "test", label: "Chapeau" },
    { id: "test2", label: "Chapeau" },
];

const options: Option[] = [
    { id: "1", image: "https://via.placeholder.com/80" },
    { id: "2", image: "https://via.placeholder.com/80" },
    { id: "3", image: "https://via.placeholder.com/80" },
    { id: "4", image: "https://via.placeholder.com/80" },
    { id: "5", image: "https://via.placeholder.com/80" },
];

export const AvatarCustomizer = () => {
    const [selectedCategory, setSelectedCategory] = useState("glasses");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <View style={styles.container}>
        {/* --- Image principale --- */}
        <View style={styles.avatarContainer}>
            <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.avatarImage}
            />
        </View>

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
            {options.map((opt) => (
            <TouchableOpacity
                key={opt.id}
                style={[
                styles.optionItem,
                selectedOption === opt.id && styles.optionItemSelected,
                ]}
                onPress={() => setSelectedOption(opt.id)}
            >
                <Image source={{ uri: opt.image }} style={styles.optionImage} />
            </TouchableOpacity>
            ))}
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
