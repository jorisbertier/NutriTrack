import { useTheme } from '@/hooks/ThemeProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

type BodyInfosProps = {
    weight: number;
    setWeight: (value: number) => void;
    height: number;
    setHeight: (value: number) => void;
    weightError: string;
    heightError: string;
};

const BodyInfoStep = ({
    weight,
    setWeight,
    height,
    setHeight,
    weightError,
    heightError,
}: BodyInfosProps) => {

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    
    const { colors } = useTheme();
    const { t } = useTranslation();

    // Weight conversions
    const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
    const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462);

    // Weight items
    const weightItems = Array.from({ length: 236 }, (_, i) => {
        const kg = i + 25;
        const label = isSwitchOn ? `${kgToLbs(kg)} lbs` : `${kg} kg`;
        return { label, value: kg };
    });

    // Height items — toujours en cm
    const heightItems = Array.from({ length: 201 }, (_, i) => {
        const cm = i + 100;
        return { label: `${cm} cm`, value: cm };
    });

    const selectedWeightIndex = weightItems.findIndex((item) => item.value === weight);
    const selectedHeightIndex = heightItems.findIndex((item) => item.value === height);
    console.log(weight)
    return (
        <>
        <View
            style={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            <Switch color={colors.blueLight} value={isSwitchOn} onValueChange={onToggleSwitch} />
            <Text style={{color: colors.black, fontWeight: "500", fontSize: 20}}>{!isSwitchOn ? t('metric') : t('imperial')}</Text>
        </View>

        <View
            style={{
            marginTop: 50,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            width: '100%',
            }}
        >
            {/* Weight */}
            <View style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
            <Text style={{ marginTop: 20, fontSize: 20, color: colors.black }}>{t('weight')}</Text>
            <WheelPickerExpo
                key={isSwitchOn ? 'lbs' : 'kg'}
                height={250}
                width={150}
                backgroundColor={colors.whiteMode}
                initialSelectedIndex={selectedWeightIndex >= 0 ? selectedWeightIndex : 0}
                items={weightItems}
                onChange={({ item }) => {
                const number = parseInt(item.label);
                const valueInKg = isSwitchOn ? lbsToKg(number) : number;
                setWeight(valueInKg);
                }}
            />
            {weightError && <Text style={{color: 'red', textAlign:'center'}}>{weightError}</Text>}
            </View>

            {/* Height */}
            <View style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
            <Text style={{ marginTop: 20, fontSize: 20, color: colors.black }}>{t('height')}</Text>
            <WheelPickerExpo
                key="cm"
                backgroundColor={colors.whiteMode}
                height={250}
                width={150}
                initialSelectedIndex={selectedHeightIndex >= 0 ? selectedHeightIndex : 0}
                items={heightItems}
                onChange={({ item }) => {
                const cm = parseInt(item.label);
                setHeight(cm);
                }}
            />
            {heightError && <Text style={{color: 'red', textAlign:'center'}}>{heightError}</Text>}
            </View>
        </View>
        </>
    );
};

export default BodyInfoStep;
