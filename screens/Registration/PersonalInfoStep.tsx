import React from 'react';
import { Text, TextInput } from 'react-native';

const PersonalInfoStep = ({ name, setName, firstname, setFirstname, dateOfBirthFormatted, showDatePicker, setShowDatePicker, onChangeDate, nameError, firstnameError, colors, styles, DateTimePicker, dateOfBirth, fiveYearsAgo }) => (
    <>
        <Text style={[styles.label, { color: colors.black }]}>Name -</Text>
        <TextInput
        style={[styles.input, { backgroundColor: colors.grayPress }]}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        autoCapitalize='words'
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Firstname -</Text>
        <TextInput
        style={[styles.input, { backgroundColor: colors.grayPress }]}
        value={firstname}
        onChangeText={setFirstname}
        placeholder="First Name"
        autoCapitalize='words'
        />
        {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}

        <Text style={[styles.label, { color: colors.black }]}>Date of birth -</Text>
        <Text onPress={() => setShowDatePicker(true)} style={[styles.dateInput, { backgroundColor: colors.grayPress }]}>{dateOfBirthFormatted || 'Select a date of birth'}</Text>
        {showDatePicker && (
        <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={fiveYearsAgo}
        />
        )}
    </>
);

export default PersonalInfoStep;
