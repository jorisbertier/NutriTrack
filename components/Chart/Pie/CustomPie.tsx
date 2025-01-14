
import React from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";

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
  
    return (
      <View>
        <Svg height={cy * 2} width={cx * 2}>
          <G x={cx} y={cy}>
            {arcs.map((arc, index) => (
              <Path
                key={`arc-${index}`}
                d={arcGenerator(arc)}
                fill={data[index].color}
                // stroke="#121212" // Ajoute une bordure sombre entre les segments (facultatif)
                // strokeWidth={1} // Taille de la bordure
              />
            ))}
          </G>
        </Svg>
      </View>
    );
  };
  
  export default CustomPie;