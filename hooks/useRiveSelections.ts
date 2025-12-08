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
    color: { machine: string; input: string };
    hat: { machine: string; input: string };
    eyes: { machine: string; input: string };
    mouth: { machine: string; input: string };
};

// export const useRiveSelections = (
//     riveRef: React.RefObject<RiveRef>,
//     categoryOptions: CategoryOptions,
//     riveMappings: RiveMapping,
// ) => {
//     const [riveReady, setRiveReady] = useState(false);
//     const [selectedOptions, setSelectedOptions] = useState<OptionMap>({});
//     const user = useSelector((state: RootState) => state.user.user);
//     const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);

//     // ✅ Consider Rive ready as soon as the ref is mounted
//     useEffect(() => {
//         if (riveRef.current) setRiveReady(true);
//     }, [riveRef]);

//     // ✅ Restore selections from AsyncStorage
//     useFocusEffect(
//         useCallback(() => {
//             const restoreSelections = async () => {
//                 try {
//                     const savedEyeColor = await AsyncStorage.getItem('EyeColor');
//                     const savedHat = await AsyncStorage.getItem('HatType');
//                     const savedEyes = await AsyncStorage.getItem('EyesType');
//                     const savedMouth = await AsyncStorage.getItem('MouthType');

//                     const newOptions: OptionMap = {
//                         color: savedEyeColor
//                             ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor))?.id || null
//                             : null,
//                         hat: savedHat
//                             ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat))?.id || null
//                             : null,
//                         eyes: savedEyes
//                             ? categoryOptions.eyes.find(opt => opt.value === parseInt(savedEyes))?.id || null
//                             : null,
//                         mouth: savedMouth
//                             ? categoryOptions.mouth.find(opt => opt.value === parseInt(savedMouth))?.id || null
//                             : null,
//                     };

//                     setSelectedOptions(newOptions);
//                 } catch (e) {
//                     console.error('Error restoring selections', e);
//                 }
//             };
//             restoreSelections();
//         }, [categoryOptions])
//     );

//     // ✅ APPLY ALL SELECTIONS AN CHONK ON RIVE WHEN ALL IS READY
//     useEffect(() => {
//         if (!riveReady || !riveRef.current) return;

//         Object.entries(selectedOptions).forEach(([category, optionId]) => {
//             if (!optionId) return;
//             const value = categoryOptions[category as keyof CategoryOptions]
//                 .find(opt => opt.id === optionId)?.value;
//             const mapping = riveMappings[category];
//             if (value !== undefined && mapping) {
//                 riveRef.current.setInputState(mapping.machine, mapping.input, value);
//             }
//         });

//         // Apply chonk
//         riveRef.current.setInputState("StateMachineChangeEyesColor", "Chonk", chonkValue);
//     }, [riveReady, selectedOptions, categoryOptions, riveMappings, riveRef, chonkValue]);

//     return { selectedOptions, setSelectedOptions };
// };

// second 
// export const useRiveSelections = (
//     riveRef: React.RefObject<RiveRef>,
//     categoryOptions: CategoryOptions,
//     riveMappings: RiveMapping
// ) => {
//     const [selectedOptions, setSelectedOptions] = useState<OptionMap>({});
//     const user = useSelector((state: RootState) => state.user.user);
//     const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);

//     // Charger les options sauvegardées
//     useEffect(() => {
//         const restoreSelections = async () => {
//         try {
//             const savedEyeColor = await AsyncStorage.getItem('EyeColor');
//             const savedHat = await AsyncStorage.getItem('HatType');
//             const savedEyes = await AsyncStorage.getItem('EyesType');
//             const savedMouth = await AsyncStorage.getItem('MouthType');

//             const newOptions: OptionMap = {
//             color: savedEyeColor
//                 ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor))?.id || null
//                 : null,
//             hat: savedHat
//                 ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat))?.id || null
//                 : null,
//             eyes: savedEyes
//                 ? categoryOptions.eyes.find(opt => opt.value === parseInt(savedEyes))?.id || null
//                 : null,
//             mouth: savedMouth
//                 ? categoryOptions.mouth.find(opt => opt.value === parseInt(savedMouth))?.id || null
//                 : null,
//             };

//             setSelectedOptions(newOptions);
//         } catch (e) {
//             console.error('Error restoring selections', e);
//         }
//         };

//         restoreSelections();
//     }, [categoryOptions]);

//     // Appliquer sur Rive avec vérification que la machine est prête
//     useEffect(() => {
//         if (!riveRef.current || Object.keys(selectedOptions).length === 0) return;

//         const applyInputs = () => {
//         if (!riveRef.current) return false;

//         let allReady = true;
//         Object.entries(selectedOptions).forEach(([category, optionId]) => {
//             if (!optionId) return;
//             const value = categoryOptions[category as keyof CategoryOptions]
//             .find(opt => opt.id === optionId)?.value;
//             const mapping = riveMappings[category];
//             if (value !== undefined && mapping) {
//             const success = riveRef.current.setInputState(mapping.machine, mapping.input, value);
//             if (!success) allReady = false; // setInputState renvoie false si machine non prête
//             }
//         });

//         // Chonk
//         const chonkSuccess = riveRef.current.setInputState("StateMachineChangeEyesColor", "Chonk", chonkValue);
//         if (!chonkSuccess) allReady = false;

//         return allReady;
//         };

//         // 🔁 Retry jusqu’à ce que la machine soit prête
//         let retries = 0;
//         const interval = setInterval(() => {
//             const ready = applyInputs();
//             if (ready || retries > 20) { // max 20 tentatives
//                 clearInterval(interval);
//             }
//             retries++;
//         }, 100);

//         return () => clearInterval(interval);
//     }, [selectedOptions, categoryOptions, riveMappings, chonkValue]);

//     return { selectedOptions, setSelectedOptions };
// };

export const useRiveSelections = (
  riveRef: React.RefObject<RiveRef>,
  categoryOptions: CategoryOptions,
  riveMappings: RiveMapping
) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionMap>({});
  const [restored, setRestored] = useState(false);
  const [riveReady, setRiveReady] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);

  // 1) Restaurer les options sauvegardées une seule fois quand categoryOptions change
  useEffect(() => {
    let mounted = true;
    const restoreSelections = async () => {
      try {
        const [savedEyeColor, savedHat, savedEyes, savedMouth] = await Promise.all([
          AsyncStorage.getItem('EyeColor'),
          AsyncStorage.getItem('HatType'),
          AsyncStorage.getItem('EyesType'),
          AsyncStorage.getItem('MouthType'),
        ]);

        const newOptions: OptionMap = {
          color: savedEyeColor
            ? categoryOptions.color.find(opt => opt.value === parseInt(savedEyeColor, 10))?.id ?? null
            : null,
          hat: savedHat
            ? categoryOptions.hat.find(opt => opt.value === parseInt(savedHat, 10))?.id ?? null
            : null,
          eyes: savedEyes
            ? categoryOptions.eyes.find(opt => opt.value === parseInt(savedEyes, 10))?.id ?? null
            : null,
          mouth: savedMouth
            ? categoryOptions.mouth.find(opt => opt.value === parseInt(savedMouth, 10))?.id ?? null
            : null,
        };

        if (!mounted) return;
        setSelectedOptions(newOptions);
        setRestored(true);
      } catch (e) {
        console.error('Error restoring selections', e);
        if (mounted) setRestored(true); // éviter blocage si erreur
      }
    };

    restoreSelections();
    return () => { mounted = false; };
  }, [categoryOptions]);

  // Helper: check si on a au moins une option non-null
  const hasAnySelection = (opts: OptionMap) =>
    Object.values(opts).some(v => v !== null && v !== undefined);

  // 2) Appliquer sur Rive : on attend que la restauration soit faite ET que riveRef.current existe
  useEffect(() => {
    if (!restored) return; // on n'applique pas tant qu'on n'a pas restauré
    if (!hasAnySelection(selectedOptions)) {
      // Si rien de restauré, on peut considérer que rien à appliquer
      setRiveReady(true);
      return;
    }
    let cancelled = false;
    let retries = 0;
    const maxRetries = 30;
    const delay = 120; // ms

    const applyInputs = () => {
      const rive = riveRef.current;
      if (!rive) return false;

      // si possible, stopper l'animation avant d'appliquer pour éviter le "flash" d'état par défaut
      try { (rive as any).pause?.(); } catch (e) { /* ignore */ }

      let allReady = true;

      try {
        Object.entries(selectedOptions).forEach(([category, optionId]) => {
          if (!optionId) return;
          const opts = categoryOptions[category as keyof CategoryOptions];
          const found = opts?.find(opt => opt.id === optionId);
          const value = found?.value;
          const mapping = riveMappings[category];
          if (value !== undefined && mapping) {
            // setInputState peut renvoyer true/false ou undefined selon l'implémentation; on coercera en bool
            const ok = !!(rive as any).setInputState(mapping.machine, mapping.input, value);
            if (!ok) allReady = false;
          }
        });

        // Chonk
        const chonkOk = !!(rive as any).setInputState("StateMachineChangeEyesColor", "Chonk", chonkValue);
        if (!chonkOk) allReady = false;
      } catch (err) {
        // si appel lance une erreur, on considère pas prêt et on réessaie
        console.warn('applyInputs error', err);
        allReady = false;
      }

      if (allReady) {
        // tout appliqué — relancer l'animation si possible
        try { (rive as any).play?.(); } catch (e) { /* ignore */ }
      }

      return allReady;
    };

    const tryLoop = () => {
      if (cancelled) return;
      const ready = applyInputs();
      if (ready || retries >= maxRetries) {
        if (!cancelled) setRiveReady(!!ready);
        return;
      }
      retries++;
      setTimeout(tryLoop, delay);
    };

    // démarrer le cycle
    tryLoop();

    return () => { cancelled = true; };
  }, [restored, selectedOptions, categoryOptions, riveMappings, chonkValue, riveRef]);

  return { selectedOptions, setSelectedOptions, riveReady };
};

export const useRiveRestore = (riveRef: React.RefObject<RiveRef>) => {
    const user = useSelector((state: RootState) => state.user.user);
    const chonkValue = calculateBMIRive(user?.weight ?? 0, user?.height ?? 0);

    const restoreSelections = async () => {
        if (!riveRef.current) return;

        const sm = "StateMachineChangeEyesColor";

        const eyeColor = await AsyncStorage.getItem("EyeColor");
        const hatType = await AsyncStorage.getItem("HatType");
        const eyesType = await AsyncStorage.getItem("EyesType");
        const mouthType = await AsyncStorage.getItem("MouthType");

        if (eyeColor !== null)
            riveRef.current.setInputState(sm, "EyeColor", Number(eyeColor));

        if (hatType !== null)
            riveRef.current.setInputState(sm, "HatType", Number(hatType));

        if (eyesType !== null)
            riveRef.current.setInputState(sm, "EyesType", Number(eyesType));

        if (mouthType !== null)
            riveRef.current.setInputState(sm, "MouthType", Number(mouthType));

        riveRef.current.setInputState(sm, "Chonk", chonkValue);
    };

    return { restoreSelections };
};
