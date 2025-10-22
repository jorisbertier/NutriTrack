import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RiveRef } from 'rive-react-native';
import { calculateBMIRive } from '@/functions/function';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type OptionMap = { [key: string]: string | null };

type CategoryOptions = {
    color: { id: string; value: number }[];
    hat: { id: string; value: number }[];
    eyes: { id: string; value: number }[];
    mouth: { id: string; value: number }[];
};

type RiveMapping = {
    
};

export const useRiveSelections = (
    riveRef: React.RefObject<RiveRef>,
    categoryOptions: CategoryOptions,
    riveMappings: RiveMapping,
) => {
    const [riveReady, setRiveReady] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<OptionMap>({});
    const user = useSelector((state: RootState) => state.user.user);
    const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);

    // ✅ Consider Rive ready as soon as the ref is mounted
    useEffect(() => {
        if (riveRef.current) setRiveReady(true);
    }, [riveRef]);

    // ✅ Restore selections from AsyncStorage
    useFocusEffect(
        useCallback(() => {
            const restoreSelections = async () => {
                try {
                    const savedEyeColor = await AsyncStorage.getItem('EyeColor');
                    const savedHat = await AsyncStorage.getItem('HatType');
                    const savedEyes = await AsyncStorage.getItem('EyesType');
                    const savedMouth = await AsyncStorage.getItem('MouthType');

                    const newOptions: OptionMap = {
                        color: savedEyeColor
                            ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor))?.id || null
                            : null,
                        hat: savedHat
                            ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat))?.id || null
                            : null,
                        eyes: savedEyes
                            ? categoryOptions.eyes.find(opt => opt.value === parseInt(savedEyes))?.id || null
                            : null,
                        mouth: savedMouth
                            ? categoryOptions.mouth.find(opt => opt.value === parseInt(savedMouth))?.id || null
                            : null,
                    };

                    setSelectedOptions(newOptions);
                } catch (e) {
                    console.error('Error restoring selections', e);
                }
            };
            restoreSelections();
        }, [categoryOptions])
    );

    // ✅ APPLY ALL SELECTIONS AN CHONK ON RIVE WHEN ALL IS READY
    useEffect(() => {
        if (!riveReady || !riveRef.current) return;

        Object.entries(selectedOptions).forEach(([category, optionId]) => {
            if (!optionId) return;
            const value = categoryOptions[category as keyof CategoryOptions]
                .find(opt => opt.id === optionId)?.value;
            const mapping = riveMappings[category];
            if (value !== undefined && mapping) {
                riveRef.current.setInputState(mapping.machine, mapping.input, value);
            }
        });

        // Apply chonk
        riveRef.current.setInputState("StateMachineChangeEyesColor", "Chonk", chonkValue);
    }, [riveReady, selectedOptions, categoryOptions, riveMappings, riveRef, chonkValue]);

    return { selectedOptions, setSelectedOptions };
};

export const useRiveRestore = (riveRef: React.RefObject<RiveRef>) => {
    const [riveReady, setRiveReady] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);
    console.log("Chonk value:", chonkValue);

    useEffect(() => {
        if (riveRef.current) setRiveReady(true);
    }, [riveRef]);

    // ✅ Utilise useFocusEffect pour relancer la restauration à chaque retour sur la page
    useFocusEffect(
        useCallback(() => {
        const restoreSelections = async () => {
            if (!riveRef.current) return;
            try {
            const eyeColor = await AsyncStorage.getItem("EyeColor");
            const hatType = await AsyncStorage.getItem("HatType");

            if (eyeColor !== null) {
                riveRef.current.setInputState(
                "StateMachineChangeEyesColor",
                "EyeColor",
                parseInt(eyeColor)
                );
            }

            if (hatType !== null) {
                riveRef.current.setInputState(
                "StateMachineChangeEyesColor",
                "HatType",
                parseInt(hatType)
                );
            }

            riveRef.current.setInputState("StateMachineChangeEyesColor", "Chonk", chonkValue);

            } catch (e) {
            console.error("Error restoring Rive inputs", e);
            }
        };

        // ✅ Si rive est déjà prêt, on restaure immédiatement
        if (riveReady) {
            restoreSelections();
        } else {
            // sinon on attend qu'il soit prêt
            const interval = setInterval(() => {
            if (riveRef.current) {
                setRiveReady(true);
                restoreSelections();
                clearInterval(interval);
            }
            }, 200);
            return () => clearInterval(interval);
        }
        }, [riveRef, riveReady])
    );
};