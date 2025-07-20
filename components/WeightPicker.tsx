import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 30;
const MIN_WEIGHT = 30;
const MAX_WEIGHT = 250;

const weights = Array.from({ length: MAX_WEIGHT - MIN_WEIGHT + 1 }, (_, i) => MIN_WEIGHT + i);

const WeightPicker = ({ selectedWeight, onChange }) => {
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
            <View style={[styles.tick, isMajorTick && styles.majorTick]} />
            {isMajorTick && <Text style={styles.label}>{item}</Text>}
        </View>
        );
    };

    return (
        <View style={styles.wrapper}>
        <Text style={styles.weightText}>{selectedWeight} kg</Text>

        <View style={styles.rulerContainer}>
            <View style={styles.centerMarker} />

            <Animated.FlatList
                ref={flatListRef}
                data={weights}
                keyExtractor={(item) => item.toString()}
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
        marginTop: 10
    },
    tickContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tick: {
        width: 2,
        height: 20,
        backgroundColor: '#ccc',
        marginBottom: 4,
    },
    majorTick: {
        height: 35,
        backgroundColor: '#ccc',
    },
    label: {
        fontSize: 12,
        width: 25,
        color: '#888',
    },
    centerMarker: {
        position: 'absolute',
        top: 0,
        bottom: 20,
        width: 2,
        backgroundColor: 'black',
        height: 40,
        left: width / 2 - 20,
        zIndex: 10,
    },
});

export default WeightPicker;
