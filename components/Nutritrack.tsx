// NutritrackWaveLogoClean.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, {
  Defs,
  Mask,
  Rect,
  Text as SvgText,
  Path,
  G,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedProps,
  interpolate,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function NutritrackWaveLogoClean() {
  const width = 340;
  const height = 50;
  const fontSize = 58;

  const progress = useSharedValue(0);
  const waveShift = useSharedValue(0);

  useEffect(() => {
progress.value = withTiming(1, { 
  duration: 8000,
  easing: Easing.inOut(Easing.quad),
});

    waveShift.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedRectProps = useAnimatedProps(() => {
    const visibleHeight = progress.value * height;
    const y = height - visibleHeight;
    return {
      y: y.toString(),
      height: visibleHeight.toString(),
    } as any;
  });

  const animatedWaveProps = useAnimatedProps(() => {
    const amplitude = 14;
    const wavelength = 90;

    const baseY = height - interpolate(progress.value, [0, 1], [0, height]);
    const offset = -waveShift.value * wavelength;

    let d = `M ${-wavelength + offset} ${baseY} `;

    for (let x = -wavelength; x < width + wavelength; x += wavelength) {
      d += `C 
        ${x + wavelength * 0.25 + offset} ${baseY - amplitude},
        ${x + wavelength * 0.75 + offset} ${baseY + amplitude},
        ${x + wavelength + offset} ${baseY} 
      `;
    }

    // FERME LA FORME ÉVITE LES CARRÉS
    d += `L ${width} ${height} L 0 ${height} Z`;

    return { d } as any;
  });

  return (
    <View style={{ width, height, justifyContent: "center", alignItems: "center" }}>
      <Svg width={width} height={height}>
        <Defs>
          <Mask id="mask">
            {/* Fond NOIR = totalement masqué */}
            <Rect x="0" y="0" width={width} height={height} fill="black" />

            {/* Partie visible = BLANC → aucun carré */}
            <AnimatedRect
              x="0"
              animatedProps={animatedRectProps}
              width={width}
              fill="white"
            />
            <AnimatedPath animatedProps={animatedWaveProps} fill="white" />
          </Mask>
        </Defs>

        {/* Texte gris */}
        <SvgText
          x={width / 2}
          y={height / 2 + fontSize / 3}
          fontSize={fontSize}
          fontWeight="700"
          textAnchor="middle"
          fill="#C8C8C8"
        >
          Nutritrack
        </SvgText>

        {/* Texte noir MASQUÉ → Remplissage propre */}
        <G mask="url(#mask)">
          <SvgText
            x={width / 2}
            y={height / 2 + fontSize / 3}
            fontSize={fontSize}
            fontWeight="700"
            textAnchor="middle"
            fill="black"
          >
            Nutritrack
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}
