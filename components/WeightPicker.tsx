import { useTheme } from '@/hooks/ThemeProvider';
import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Animated,
    Image,
    ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 30;
const MIN_WEIGHT = 30;
const MAX_WEIGHT = 250;

const weights = Array.from({ length: MAX_WEIGHT - MIN_WEIGHT + 1 }, (_, i) => MIN_WEIGHT + i);

const WeightPicker = ({ selectedWeight, onChange, weight, isLoading }) => {

    const { colors } = useTheme();


    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // 🧠 Met à jour dynamiquement le poids pendant le scroll
    useEffect(() => {
        const listenerId = scrollX.addListener(({ value }) => {
        const index = Math.round(value / ITEM_WIDTH);
        const weight = MIN_WEIGHT + index;

        onChange(weight.toString());
        });

        return () => scrollX.removeListener(listenerId);
    }, [scrollX]);

    // Centrage initial
    useEffect(() => {
        const index = parseInt(selectedWeight) - MIN_WEIGHT;
        flatListRef.current?.scrollToOffset({
        offset: index * ITEM_WIDTH,
        animated: false,
        });
    }, []);

    const handleMomentumScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / ITEM_WIDTH);

        flatListRef.current?.scrollToOffset({
        offset: index * ITEM_WIDTH,
        animated: true,
        });
    };

    const renderItem = ({ item }) => {
        const isMajorTick = item % 5 === 0;

        return (
        <View style={styles.tickContainer}>
            <View style={[styles.tick, isMajorTick && styles.majorTick, { backgroundColor: colors.grayDarkFix}]} />
            {isMajorTick && <Text style={[styles.label, { color : colors.black}]}>{item}</Text>}
        </View>
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={{marginBottom: 20, display: 'flex', flexDirection: 'row',alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
                <View style={{backgroundColor: colors.gray, height: 100, width: 120,borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.blackFix} />
                    ) : (
                    <Text style={styles.weightText}>{weight}</Text>
                    )}
                </View>
                <Image source={require('@/assets/images/arrow-right.png')} style={{tintColor: colors.blzck, width: 20, height: 20}}  />
                <View style={{backgroundColor: colors.blueLight, height: 100, width: 120,borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.weightText}>{selectedWeight}</Text>
                </View>
            </View>

        <View style={styles.rulerContainer}>
            <View style={[styles.centerMarker, {backgroundColor: colors.black}]} />

            <Animated.FlatList
                ref={flatListRef}
                data={weights}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: width / 2 - ITEM_WIDTH / 2 - 20,
                }}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                renderItem={renderItem}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
        height: 200,
        display: 'flex'
    },
    weightText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        width: '100%',
        textAlign: 'center',
    },
    rulerContainer: {
        position: 'relative',
        marginTop: 20
    },
    tickContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tick: {
        width: 2,
        height: 20,
        marginBottom: 4,
    },
    majorTick: {
        height: 35,
    },
    label: {
        fontSize: 12,
        width: 25,
    },
    centerMarker: {
        position: 'absolute',
        top: 0,
        bottom: 20,
        width: 2,
        height: 40,
        left: width / 2 - 21,
        zIndex: 10,
    },
});

export default WeightPicker;
