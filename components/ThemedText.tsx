// import { Text, type TextProps, StyleSheet } from 'react-native';

// import { useThemeColor } from '@/hooks/useThemeColor';

// export type ThemedTextProps = TextProps & {
//   lightColor?: string;
//   darkColor?: string;
//   type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
// };

// export function ThemedText({
//   style,
//   lightColor,
//   darkColor,
//   type = 'default',
//   ...rest
// }: ThemedTextProps) {
//   const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

//   return (
//     <Text
//       style={[
//         { color },
//         type === 'default' ? styles.default : undefined,
//         type === 'title' ? styles.title : undefined,
//         type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
//         type === 'subtitle' ? styles.subtitle : undefined,
//         type === 'link' ? styles.link : undefined,
//         style,
//       ]}
//       {...rest}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   default: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   defaultSemiBold: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: '600',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     lineHeight: 32,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   link: {
//     lineHeight: 30,
//     fontSize: 16,
//     color: '#0a7ea4',
//   },
// });
import { Colors } from "@/constants/Colors";
import useThemeColors from "@/hooks/useThemeColor";
import { TextProps, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    body: {
        fontSize: 10,
        lineHeight: 16
    },
    headline: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
    },
    caption: {
        fontSize: 8,
        lineHeight: 12,
    },
    title : {
        fontSize: 28,
        fontWeight: "bold",
    },
    title1: {
        fontSize: 16,
        lineHeight: 16,
        fontWeight: "bold",
    },
    title2: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "bold",
    },
    title3: {
        fontSize: 10,
        lineHeight: 16,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16,
    },
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors["light"] | string
}

export function ThemedText({variant, color, style,  ...rest}: Props) {
    const colors = useThemeColors()
    
    const finalColor = typeof color === 'string' ? color : (colors[color as keyof typeof colors] ?? 'black');
    // {color: colors[color ?? 'black']}
    return (
        <Text style={[styles[variant ?? 'body'], {color: finalColor}, style]} {...rest}/>
    )
}
