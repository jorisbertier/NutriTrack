import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RiveRef } from 'rive-react-native';
import { calculateBMI, calculateBMIRive } from '@/functions/function';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type OptionMap = { [key: string]: string | null };

type CategoryOptions = {
    color: { id: string; value: number }[];
    hat: { id: string; value: number }[];
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

    /** ✅ WAIT RIVE IS READY */
    useEffect(() => {
        let checkInterval: ReturnType<typeof setInterval>;
        const waitUntilReady = () => {
        if (riveRef.current) {
            // / WAIT WITH A LITTLE DELAY TO ENSURE THE MACHINE IS READY
            checkInterval = setTimeout(() => setRiveReady(true), 300);
        }
        };
        waitUntilReady();
        return () => clearTimeout(checkInterval);
    }, [riveRef]);

    /** ✅ Restaurer les sélections quand on revient sur la page */
    useFocusEffect(
        useCallback(() => {
        const restoreSelections = async () => {
            try {
            const savedEyeColor = await AsyncStorage.getItem('EyeColor');
            const savedHat = await AsyncStorage.getItem('HatType');

            const newOptions: OptionMap = {
                color: savedEyeColor
                ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor))?.id || null
                : null,
                hat: savedHat
                ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat))?.id || null
                : null,
            };

            setSelectedOptions(newOptions);
            } catch (e) {
            console.error('Error restoring selections', e);
            }
        };
        restoreSelections();
        }, [])
    );

    /** ✅ Appliquer sur Rive après un petit délai pour être sûr que la machine soit initialisée */
    useEffect(() => {
        if (!riveReady || !riveRef.current) return;
console.log(riveRef.current)
        const timeout = setTimeout(() => {
        Object.entries(selectedOptions).forEach(([category, optionId]) => {
            if (!optionId) return;
            const value = categoryOptions[category as keyof CategoryOptions].find(opt => opt.id === optionId)?.value;
            const mapping = riveMappings[category];
            if (value !== undefined && mapping) {
            console.log(`🎨 Applying ${category}:`, value);
            riveRef.current?.setInputState(mapping.machine, mapping.input, value);
            
            }
        });
        }, 250);

        return () => clearTimeout(timeout);
    }, [riveReady, selectedOptions, categoryOptions, riveMappings, riveRef]);

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
            riveRef.current.setInputState("StateMachineChangeEyesColor", "Chonk", 31);
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