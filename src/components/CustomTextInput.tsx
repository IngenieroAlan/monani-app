import React from 'react';
import { Control, Controller, FieldError, FieldPath, FieldValues } from "react-hook-form";
import { View, ViewProps } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface Props<T extends FieldValues> {
    label: string;
    helperText: string;
    placeholder?: string;
    control: Control<T>;
    more?: TextInputProps;
    name: FieldPath<T>;
    errors: FieldError | undefined;
    containerStyle?: ViewProps;
}

export const CustomTextInput = <T extends FieldValues>({ name, label, placeholder = "", errors, helperText, control, containerStyle, more }: Props<T>) => {
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
