
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import { useTheme } from "@/hooks/ThemeProvider";
import { Event } from "@react-native-community/datetimepicker";

interface PieData {
  value: string;
  color: string;
}
const CustomPie = ({
  data,
  innerRadius = 30,
  outerRadius = 100,
  paddingAngle = 0.02, // Espace entre les segments (en radians)
  cornerRadius = 5,
  startAngle = 0,
  endAngle = 2 * Math.PI,
  cx = 150,
  cy = 150,
  }) => {
  // Générateur de "pie"
  const { colors } = useTheme();
  const [ value, setValue] = useState('')
  const [ color, setColor] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [ dataVisible, setDataVisible] = useState(false)

  const pieGenerator = d3
    .pie()
    .startAngle(startAngle)
    .endAngle(endAngle)
    .padAngle(paddingAngle) // Appliquer l'espace entre les segments
    .value((d) => d.value);

  // Générateur d'arc
  const arcGenerator = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius);

  // Créer les arcs à partir des données
  const arcs = pieGenerator(data);

  const handleData = (data: PieData, event: Event) => {
    setValue(data.value)
    setColor(data.color)
    console.log(data)

    const { locationX, locationY } = event.nativeEvent;
    setPosition({ x: locationX, y: locationY });
  }

  return (
    <View>
      <Svg height={cy * 2} width={cx * 2}>
        <G x={cx} y={cy}>
          {arcs.map((arc, index) => (
              <Path
                d={arcGenerator(arc)}
                fill={data[index].color}
                onPressIn={(event) => handleData(data[index], event)}
                // stroke="#121212" // Ajoute une bordure sombre entre les segments (facultatif)
                // strokeWidth={1} // Taille de la bordure
              />
          ))}
        </G>
      </Svg>
      <View style={[styles.notification, {top: position.y - 50, left: position.x - 75,}]}>
        <View style={[styles.wrapperNotification, {backgroundColor: "#000", opacity: 0.8}]}>
          <View style={[styles.circle, {backgroundColor: color}]}></View>
          <Text style={[styles.notificationText, {color: colors.grayDark}]}>Proteins</Text>
          <Text style={[styles.notificationText, {color: colors.grayDark}]}>{value} %</Text>
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    bottom: 20,
    width: '50%',
    alignSelf: 'center'
  },
  wrapperNotification : {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-around',
      gap: 20,
      padding: 10,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2, 
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    },
  notificationText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10/2
  }
})
  
export default CustomPie;