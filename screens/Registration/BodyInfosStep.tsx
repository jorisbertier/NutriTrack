import React from 'react';
import { Text, TextInput } from 'react-native';

const BodyInfoStep = ({ weight, setWeight, height, setHeight, weightError, heightError, colors, styles }) => (
    <>
        <Text style={[styles.label, { color: colors.black }]}>Weight -</Text>
        <TextInput
        style={[styles.input, { backgroundColor: colors.grayPress }]}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        />
        {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Height -</Text>
        <TextInput
        style={[styles.input, { backgroundColor: colors.grayPress }]}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        />
        {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
    </>
);

export default BodyInfoStep;