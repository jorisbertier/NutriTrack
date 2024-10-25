import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function TabBarButton({onPress,onLongPress,isFocused,color,label,routeName}: any) {
    const icon = {
        index: (props: any) => <Feather name="home" size={24} color={props.color} />,
        explore: (props: any) => <Feather name="search" size={24} color={props.color} />,
        profile: (props: any) => <Feather name="user" size={24} color={props.color} />
      };

      const scale = useSharedValue(0)
      useEffect(() => {
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,{duration : 350})
      }, [scale, isFocused])
    
      const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
      const top = interpolate(scale.value, [0, 1], [0, 9]);
      
        return {
        transform: [{
            scale: scaleValue
        }],
        top
      }
    })
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0])
        return {opacity}
    })
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={animatedIconStyle}>
            {icon[routeName  as keyof typeof icon] ? icon[routeName  as keyof typeof icon]({ color: isFocused ? '#fff' : '#222' }) : null}

            </Animated.View>
        
            <Feather name='home' size={24} color={'#222'}/>
            <Animated.Text style={[{ color: isFocused ? '#673AB7' : '#222', fontSize: 12 }, animatedStyle]}>
            {label}
            </Animated.Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor : '#fff',
        alignItems: 'center',
        marginHorizontal: 80,
        paddingVertical: 15,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset : {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    tabbarItem : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    }
})