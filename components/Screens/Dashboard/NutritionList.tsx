import NutritionItem from "@/components/Screens/Details/NutritionItem";
import { View } from "react-native";

interface NutritionData {
    name: string;
    quantity: number;
    unit: string;
}

type Props = {
    data: NutritionData[]
}
const NutritionList = ({ data }: Props) => {

    return (
        <View>
        {data.map((item, id) => (
            <NutritionItem key={`${id}-${item.name}-${Math.random()}`} name={item.name} quantity={item.quantity} unit={item.unit} />
        ))}
        </View>
    );
};

export default NutritionList;