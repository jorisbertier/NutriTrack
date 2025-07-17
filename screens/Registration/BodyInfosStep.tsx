import React from 'react';
import { Text, View } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

type BodyInfosProps = {
    weight: number;
    setWeight: (value: number) => void;
    height: number;
    setHeight: (value: number) => void;
    weightError: string;
    heightError: string;
}

const BodyInfoStep = ({ weight, setWeight, height, setHeight, weightError, heightError }: BodyInfosProps) => {

    const WEIGHTS = Array.from({ length: 236 }, (_, i) => `${i + 15} kg`);
    const HEIGHTS = Array.from({ length: 201 }, (_, i) => `${i + 50} cm`);
    
    return (
        <>
            <View style={{ marginTop: 50, display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
                <View style={{width: '50%', display: "flex", alignItems: 'center'}}>
                    <Text style={{ marginTop: 20, fontSize: 20}}>Weight</Text>
                    <WheelPickerExpo
                        height={250}
                        width={150}
                        initialSelectedIndex={70} 
                        items={WEIGHTS.map(w => ({ label: w, value: w }))}
                        onChange={({ item }) => {
                            const numericWeight = Number(item.label.replace(' kg', ''));
                            setWeight(numericWeight);
                        }}
                    />
                    {weightError && <Text>{weightError}</Text>}
                </View>
                <View style={{width : '50%', display: 'flex', alignItems: 'center'}}>
                    <Text style={{ marginTop: 20, fontSize: 20 }}>Height</Text>
                    <WheelPickerExpo
                        height={250}
                        width={150}
                        initialSelectedIndex={70} // exemple : 70kg par défaut
                        items={HEIGHTS.map(w => ({ label: w, value: w }))}
                        onChange={({ item }) => {
                            const numericHeight = Number(item.label.replace(' cm', ''));
                            setHeight(numericHeight);
                        }}
                    />
                    {heightError && <Text>{heightError}</Text>}
                </View>
            </View >
        </>
    );
}

export default BodyInfoStep;