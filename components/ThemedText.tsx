import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/ThemeProvider";
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
        height: 20
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
    banner: {
        fontSize: 20,
        fontWeight: "500",
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16,
    },
    subtitle1: {
        fontSize: 28,
        fontWeight: "bold",
    },
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors["light"] | keyof typeof Colors["dark"] | string
}

export function ThemedText({variant, color, style,  ...rest}: Props) {
    
    const {colors} = useTheme();

    const finalColor = colors[color as keyof typeof colors] ?? color;
    // {color: colors[color ?? 'black']}
    return (
        <Text style={[styles[variant ?? 'body'], {color: finalColor}, style]} {...rest}/>
    )
}
