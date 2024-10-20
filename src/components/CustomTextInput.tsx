import React from 'react';
import { Control, Controller, FieldError, FieldValues } from "react-hook-form";
import { View, ViewProps } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface Props {
    label: string;
    helperText: string;
    placeholder?: string;
    control: Control<FieldValues | any>;
    more?: TextInputProps;
    name: string;
    errors: FieldError | undefined;
    containerStyle?: ViewProps;
}

export const CustomTextInput = ({ name, label, placeholder = "", errors, helperText, control, containerStyle, more }: Props) => {
    return (
        <View style={containerStyle}>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label={label}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        mode="outlined"
                        error={errors && true}
                        {...more}
                    />)}
                name={name}
            />
            {
                errors && <HelperText type="error">
                    {helperText}
                </HelperText>
            }

        </View>
    )
}
