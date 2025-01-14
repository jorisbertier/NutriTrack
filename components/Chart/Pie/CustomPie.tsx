
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import { useTheme } from "@/hooks/ThemeProvider";
import { Event } from "@react-native-community/datetimepicker";

interface PieData {
  value: string;
  color: string;
  macro: string;
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
  totalMacronutrients,
  }) => {
  
  const { width: windowWidth } = useWindowDimensions();

  const { colors } = useTheme();
  const [ macro, setMacro] = useState('')
  const [ percent, setPercent] = useState(0)
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

    setMacro(data.macro)
    setColor(data.color)
    setDataVisible(true)

    getPorcentageSlicePie(Number(data.value), totalMacronutrients)

    const { locationX, locationY } = event.nativeEvent;
    setPosition({ x: locationX, y: locationY });
  }

  const getPorcentageSlicePie = (value: number, total: number) => {
    const percent = Math.round((value / total) * 100)
    setPercent(percent)
  }

  return (
    <View style={{width: windowWidth, alignItems: 'center'}}>
      <Svg height={cy * 2} width={cx * 2}>
        <G x={cx} y={cy}>
          {arcs.map((arc, index) => (
              <Path
                key={index}
                d={arcGenerator(arc)}
                fill={data[index].color}
                onPressIn={(event) => handleData(data[index], event)}
                // stroke="#121212" // Ajoute une bordure sombre entre les segments (facultatif)
                // strokeWidth={1} // Taille de la bordure
              />
          ))}
        </G>
      </Svg>
      {dataVisible &&
        <View style={[styles.modal, {top: position.y - 50, left: position.x - 75,}]}>
          <View style={[styles.wrapperNotification, {backgroundColor: "#000", opacity: 0.8}]}>
            <View style={[styles.circle, {backgroundColor: color}]}></View>
            <Text style={[styles.notificationText, {color: colors.grayDark}]}>{macro}</Text>
            <Text style={[styles.notificationText, {color: colors.whiteFix}]}>{percent} %</Text>
            </View>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
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