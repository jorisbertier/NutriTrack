import { ThemedText } from "@/components/ThemedText"
import { Image, Pressable, StyleSheet, View, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import Row from "@/components/Row";
import NutritionStatCard from "@/components/Screens/Details/NutritionStatCard";
import { Dimensions } from "react-native";
import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { foodData } from "@/data/food";
import { FoodItem } from "@/interface/FoodItem";
import { useTheme } from "@/hooks/ThemeProvider";

const { height } = Dimensions.get('window');

export default function DetailsFood() {

    const {theme, colors} = useTheme();

    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params; 

    const [data, setData] = useState<FoodItem[]>([]);
    // const [text, onChangeText] = useState('');

    useEffect(() => {
        try {
                setData(foodData);
        } catch (e) {
            console.log('Error processing data', e);
        }
    }, []);

    const filterUniqueFood = data.find((element) => element.id === id)

    const values = [filterUniqueFood?.proteins, filterUniqueFood?.carbohydrates, filterUniqueFood?.fats]
    values.sort((a, b) => a - b);
    
    const associations = { [values[0]]: 65, [values[1]]: 90, [values[2]]: 120 };

    const associatedValues = {
    proteins: associations[filterUniqueFood?.proteins],
    carbohydrates: associations[filterUniqueFood?.carbohydrates],
    fats: associations[filterUniqueFood?.fats],
    };

    
    return (
    <ScrollView>
        <View style={styles.banner}>
            <Image source={{uri: `${filterUniqueFood?.image}`}} style={styles.image} />
            <Pressable onPress={()=> navigation.goBack()} style={[styles.back, {backgroundColor: colors.white}]}>
                {theme === 'light' ?
                    <Image source={require('@/assets/images/back.png')} style={styles.icon} />
                :
                    <Image source={require('@/assets/images/backWhite.png')} style={styles.icon} />
                }
            </Pressable>
        </View>
        <View style={[styles.header, {backgroundColor: colors.white}]}>
            <Row>
                <View style={styles.wrapperBlock}>
                    <View style={styles.block}>
                        <ThemedText color={colors.black} style={[{borderColor: colors.black, fontSize: 12, fontWeight: '500'}]}>{filterUniqueFood?.category}</ThemedText>
                    </View>
                    <View style={styles.block}>
                        <ThemedText color={colors.black} style={[{borderColor: colors.black, fontSize: 12, fontWeight: '500'}]}>{filterUniqueFood?.calories} kcal</ThemedText>
                    </View>
                </View>
            </Row>
            <Row style={styles.wrapperTitle}>
                <ThemedText color={colors.black} variant="title" style={styles.title}>{filterUniqueFood?.name}</ThemedText>
                <ThemedText color={colors.black} style={[styles.subtitle, {borderColor: colors.grayDark}]} variant='title1'>{filterUniqueFood?.quantity + " " + filterUniqueFood?.unit}</ThemedText>
                <ThemedText color={colors.black} variant="title1" style={styles.title}>Good for diet - {filterUniqueFood?.calories} kcal</ThemedText>
            </Row>
            <View style={[styles.container]}>
                <Row gap={10}>
                    <NutritionStatCard
                        nutri={`proteins`}
                        quantity={filterUniqueFood?.proteins}
                        unit={'g'}
                        height={associatedValues["proteins"]}
                        source={require('@/assets/images/nutritional/meat.png')}
                    />
                    <NutritionStatCard
                        nutri={'carbs'}
                        quantity={filterUniqueFood?.carbohydrates}
                        unit={'g'}
                        height={associatedValues["carbohydrates"]}
                        source={require('@/assets/images/nutritional/cutlery.png')}
                    />
                    <NutritionStatCard
                        nutri={'fats'}
                        quantity={filterUniqueFood?.fats}
                        unit={'g'}
                        height={associatedValues["fats"]}
                        source={require('@/assets/images/nutritional/water.png')}
                    />
                </Row>
            </View> 
            <View>

                {filterUniqueFood?.proteins ? <NutritionItem name={'Proteins'} quantity={filterUniqueFood?.proteins } unit={'g'}/> : null}
                {filterUniqueFood?.carbohydrates ? <NutritionItem name={'Carbs'} quantity={filterUniqueFood?.carbohydrates} unit={'g'}/> : null}
                {filterUniqueFood?.fats ? <NutritionItem name={'Fats'} quantity={filterUniqueFood?.fats}  unit={'g'}/> : null}
                
                {filterUniqueFood?.vitaminA ? <NutritionItem name={'Vitamins A'} quantity={filterUniqueFood?.vitaminA} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB1 ? <NutritionItem name={'Vitamins B1'} quantity={filterUniqueFood?.vitaminB1} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB6 ? <NutritionItem name={'Vitamins B6'} quantity={filterUniqueFood?.vitaminB6} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminB12 ? <NutritionItem name={'Vitamins B12'} quantity={filterUniqueFood?.vitaminB12} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminC ? <NutritionItem name={'Vitamins C'} quantity={filterUniqueFood?.vitaminC} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminD ? <NutritionItem name={'Vitamins D'} quantity={filterUniqueFood?.vitaminD} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminE ? <NutritionItem name={'Vitamins E'} quantity={filterUniqueFood?.vitaminE} unit={'g'}/> : null}
                {filterUniqueFood?.vitaminK ? <NutritionItem name={'Vitamins K'} quantity={filterUniqueFood?.vitaminK} unit={'g'}/> : null}
                {filterUniqueFood?.folate ? <NutritionItem name={'Folate'} quantity={filterUniqueFood?.folate} unit={'g'}/> : null}
            
                {filterUniqueFood?.potassium ? <NutritionItem name={'Potassium'} quantity={filterUniqueFood?.potassium} unit={'g'}/> : null}
                {filterUniqueFood?.magnesium ? <NutritionItem name={'Magnesium'} quantity={filterUniqueFood?.magnesium} unit={'g'}/> : null}
                {filterUniqueFood?.calcium ? <NutritionItem name={'Calcium'} quantity={filterUniqueFood?.calcium} unit={'g'}/> : null}
                {filterUniqueFood?.iron ? <NutritionItem name={'Iron'} quantity={filterUniqueFood?.iron} unit={'g'}/> : null}
            </View>
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
        padding: 8,
        width: 'auto',
        maxWidth: 120,
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
        marginTop: -20,
        paddingBottom: 40
    },
})