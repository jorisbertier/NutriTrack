import { ReactNode } from "react"
import { View, ViewStyle } from "react-native"

type Props = {
    gap?: number,
    style?: ViewStyle,
    children?: ReactNode
}

export default function Row({style,children, gap, ...rest}: Props) {
    return (
        <View style={[rowStyle, gap ? {gap} : undefined, style]} {...rest}>
            {children}
        </View>
    )
}

const rowStyle: ViewStyle = {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
} satisfies ViewStyle