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
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get('window');

export default function DetailsFood() {

    const {theme, colors} = useTheme();

    const navigation = useNavigation();
    const { t } = useTranslation();
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

    const handleGoBack = () => {
          navigation.goBack();
      };

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
    <ScrollView persistentScrollbar={true}>
        <View style={styles.banner}>
            <Image source={{uri: `${filterUniqueFood?.image}`}} style={styles.image} />
            <Pressable onPress={handleGoBack} style={[styles.back, {backgroundColor: colors.white}]}>
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
                    <View style={[styles.block, {borderColor: colors.black}]}>
                        <ThemedText color={colors.black} style={[{fontSize: 12, fontWeight: '500'}]}>{filterUniqueFood?.category}</ThemedText>
                    </View>
                    <View style={[styles.block, {borderColor: colors.black}]}>
                        <ThemedText color={colors.black} style={[{fontSize: 12, fontWeight: '500'}]}>{filterUniqueFood?.calories} kcal</ThemedText>
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
                        nutri={t('proteins')}
                        quantity={filterUniqueFood?.proteins}
                        unit={'g'}
                        height={associatedValues["proteins"]}
                        source={require('@/assets/images/nutritional/meat.png')}
                    />
                    <NutritionStatCard
                        nutri={t('carbs')}
                        quantity={filterUniqueFood?.carbohydrates}
                        unit={'g'}
                        height={associatedValues["carbohydrates"]}
                        source={require('@/assets/images/nutritional/cutlery.png')}
                    />
                    <NutritionStatCard
                        nutri={t('fats')}
                        quantity={filterUniqueFood?.fats}
                        unit={'g'}
                        height={associatedValues["fats"]}
                        source={require('@/assets/images/nutritional/water.png')}
                    />
                </Row>
            </View> 
            <View>
                {filterUniqueFood?.proteins ? <NutritionItem name={t('proteins')} quantity={filterUniqueFood?.proteins } unit={'g'}/> : null}
                {filterUniqueFood?.carbohydrates ? <NutritionItem name={t('carbs')} quantity={filterUniqueFood?.carbohydrates} unit={'g'}/> : null}
                {filterUniqueFood?.fats ? <NutritionItem name={t('fats')} quantity={filterUniqueFood?.fats}  unit={'g'}/> : null}

                {filterUniqueFood?.potassium ? <NutritionItem name={t('potassium')} quantity={filterUniqueFood?.potassium} unit={'g'}/> : null}
                {filterUniqueFood?.magnesium ? <NutritionItem name={t('magnesium')} quantity={filterUniqueFood?.magnesium} unit={'g'}/> : null}
                {filterUniqueFood?.calcium ? <NutritionItem name={t('calcium')} quantity={filterUniqueFood?.calcium} unit={'g'}/> : null}
                {filterUniqueFood?.sodium ? <NutritionItem name={t('sodium')} quantity={filterUniqueFood?.sodium} unit={'g'}/> : null}
                {filterUniqueFood?.iron ? <NutritionItem name={t('iron')} quantity={filterUniqueFood?.iron} unit={'g'}/> : null}
                {filterUniqueFood?.folate ? <NutritionItem name={t('folate')} quantity={filterUniqueFood?.folate} unit={'%'}/> : null}
                
                {filterUniqueFood?.vitaminA ? <NutritionItem name={t('vitaminA')} quantity={filterUniqueFood?.vitaminA} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB1 ? <NutritionItem name={t('itaminB1')} quantity={filterUniqueFood?.vitaminB1} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB5 ? <NutritionItem name={t('vitaminB5')} quantity={filterUniqueFood?.vitaminB5} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB6 ? <NutritionItem name={t('vitaminB6')} quantity={filterUniqueFood?.vitaminB6} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminB12 ? <NutritionItem name={t('vitaminB12')} quantity={filterUniqueFood?.vitaminB12} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminC ? <NutritionItem name={t('vitaminC')} quantity={filterUniqueFood?.vitaminC} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminD ? <NutritionItem name={t('vitaminD')} quantity={filterUniqueFood?.vitaminD} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminE ? <NutritionItem name={t('vitaminE')} quantity={filterUniqueFood?.vitaminE} unit={'%'}/> : null}
                {filterUniqueFood?.vitaminK ? <NutritionItem name={t('vitaminK')} quantity={filterUniqueFood?.vitaminK} unit={'%'}/> : null}

                
            </View>
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    banner: {
        position: 'relative',
        width: '100%',
        height: 350,
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
        borderWidth: 1,
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