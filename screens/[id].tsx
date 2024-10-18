import { ThemedText } from "@/components/ThemedText"
import { Image, Pressable, StyleSheet, View, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import Row from "@/components/Row";
import useThemeColors from "@/hooks/useThemeColor";
import NutritionStatCard from "@/components/Screens/Details/NutritionStatCard";
import { Dimensions } from "react-native";
import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { foodData, foodData2 } from "@/data/food";
import { FoodItem, FoodItem2 } from "@/interface/FoodItem";

const { height } = Dimensions.get('window');

export default function DetailsFood() {
    const colors = useThemeColors() 
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params; 

    const [data, setData] = useState<FoodItem2[]>([]);
    // const [text, onChangeText] = useState('');

    useEffect(() => {
        try {
                setData(foodData2);
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, []);

    const filterUniqueFood = data.find((element) => element.id === id)

    console.log(filterUniqueFood?.proteins);
    console.log(typeof filterUniqueFood?.proteins);

    return (
    <ScrollView>
        <View style={styles.banner}>
            <Image source={{uri: `${filterUniqueFood?.image}`}} style={styles.image} />
            <Pressable onPress={()=> navigation.goBack()} style={styles.back}>
                
                    <Image source={require('@/assets/images/back.png')} style={styles.icon} />
                
            </Pressable>
        </View>
        <View style={[styles.header, {backgroundColor: colors.white}]}>
            <Row>
                <View style={styles.wrapperBlock}>
                    <View style={styles.block}>
                        <ThemedText style={[{borderColor: colors.grayDark}]}>{filterUniqueFood?.category}</ThemedText>
                    </View>
                    <View style={styles.block}>
                        <ThemedText style={[{borderColor: colors.grayDark}]}>{filterUniqueFood?.calories} kcal</ThemedText>
                    </View>
                </View>
            </Row>
            <Row style={styles.wrapperTitle}>
                <ThemedText variant="title" style={styles.title}>{filterUniqueFood?.name}</ThemedText>
                <ThemedText style={[styles.subtitle, {borderColor: colors.grayDark}]} variant='title1'>{filterUniqueFood?.quantity + " " + filterUniqueFood?.unit}</ThemedText>
                <ThemedText variant="title1" style={styles.title}>Good for diet - {filterUniqueFood?.calories} kcal</ThemedText>
            </Row>
            <View style={[styles.container]}>
                <Row gap={10}>
                    <NutritionStatCard
                        nutri={`proteins`}
                        quantity={filterUniqueFood?.proteins}
                        unit={'g'}
                        backgroundcolor={'#000000'}
                    />
                    <NutritionStatCard
                        nutri={'carbs'}
                        quantity={filterUniqueFood?.carbohydrates}
                        unit={'g'}
                        backgroundcolor={'#FF8400'}
                    />
                    <NutritionStatCard
                        nutri={'fats'}
                        quantity={filterUniqueFood?.fats}
                        unit={'g'}
                        backgroundcolor={'#4A83D4'}
                    />
                </Row>
            </View> 
            {/* <View>

                {filterUniqueFood?.nutrition.macronutrients.proteins ? <NutritionItem name={'Proteins'} quantity={`${filterUniqueFood?.nutrition.macronutrients.proteins.total+ " " + filterUniqueFood?.nutrition.macronutrients.proteins.unit}`}/> : null}
                {filterUniqueFood?.nutrition.macronutrients.carbohydrates ? <NutritionItem name={'Carbs'} quantity={`${filterUniqueFood?.nutrition.macronutrients.carbohydrates.total+ " " + filterUniqueFood?.nutrition.macronutrients.carbohydrates.unit +  ' - ' + filterUniqueFood?.nutrition.macronutrients.carbohydrates.fiber + ' Fibers'}`}/> : null}
                {filterUniqueFood?.nutrition.macronutrients.fats ? <NutritionItem name={'Fats'} quantity={`${filterUniqueFood?.nutrition.macronutrients.fats.total+ " " + filterUniqueFood?.nutrition.macronutrients.fats.unit}`}/> : null}
                
                {filterUniqueFood?.nutrition?.vitamins?.vitaminA ? <NutritionItem name={'Vitamins A'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminA.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminA.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminB1 ? <NutritionItem name={'Vitamins B1'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminB1.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminB1.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminB6 ? <NutritionItem name={'Vitamins B6'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminB6.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminB6.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminB12 ? <NutritionItem name={'Vitamins B12'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminB12.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminB12.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminC ? <NutritionItem name={'Vitamins C'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminC.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminC.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminD ? <NutritionItem name={'Vitamins D'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminD.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminD.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminE ? <NutritionItem name={'Vitamins E'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminE.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminE.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.vitaminK ? <NutritionItem name={'Vitamins K'} quantity={`${filterUniqueFood?.nutrition.vitamins.vitaminK.amount+ " " + filterUniqueFood?.nutrition.vitamins.vitaminK.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.vitamins?.folate ? <NutritionItem name={'Folate'} quantity={`${filterUniqueFood?.nutrition.vitamins.folate.amount+ " " + filterUniqueFood?.nutrition.vitamins.folate.unit}`}/> : null}
            
                {filterUniqueFood?.nutrition?.minerals?.potassium ? <NutritionItem name={'Potassium'} quantity={`${filterUniqueFood?.nutrition.minerals.potassium.amount+ " " + filterUniqueFood?.nutrition.minerals.potassium.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.minerals?.magnesium ? <NutritionItem name={'Magnesium'} quantity={`${filterUniqueFood?.nutrition.minerals.magnesium.amount+ " " + filterUniqueFood?.nutrition.minerals.magnesium.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.minerals?.calcium ? <NutritionItem name={'Calcium'} quantity={`${filterUniqueFood?.nutrition.minerals.calcium.amount+ " " + filterUniqueFood?.nutrition.minerals.calcium.unit}`}/> : null}
                {filterUniqueFood?.nutrition?.minerals?.iron ? <NutritionItem name={'Iron'} quantity={`${filterUniqueFood?.nutrition.minerals.iron.amount+ " " + filterUniqueFood?.nutrition.minerals.iron.unit}`}/> : null}
            </View> */}
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'relative',
        width: '100%',
        height: 350
    },
    header: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        height: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        top: -35,
        backgroundColor: 'white'
    },
    image: {
        objectFit: 'fill',
        width: '100%',
        height: 350
    },
    back: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 13,
        backgroundColor: 'white',
        top: 100,
        left: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 25,
        height: 25
    },
    wrapperBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        marginTop: 40,
    },
    block: {
        borderWidth: 2,
        borderRadius: 7,
        padding: 6,
        width: height *0.07,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapperTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'column',
        overflow: "visible"
    },
    title: {
        height: 50,
    },
    subtitle : {
        marginBottom: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        marginTop: -20
    },
})