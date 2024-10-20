import { colors } from '@/utils/colors';
import React from 'react'
import { View, ViewProps } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper'
import { Control, Controller, FieldError, FieldValues, RegisterOptions } from "react-hook-form"

interface Props {
    label: string;
    helperText: string;
    placeholder?: string;
    control: Control<FieldValues | any>;
    rules: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    more?: TextInputProps;
    name: string;
    errors: FieldError | undefined;
    containerStyle?: ViewProps;
}

export const CustomTextInput = ({ name, label, placeholder = "", errors, helperText, control, rules, containerStyle, more }: Props) => {
    return (
        <View style={containerStyle}>
            <Controller
                control={control}
                rules={rules}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label={label}
                        value={value}
                        onBlur={onBlur}
                        textColor={colors.input.main}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        placeholderTextColor={colors.input.placeHolder}
                        mode="outlined"
                        error={errors && true}
                        {...more}
                    />)}
                name={name}
            />
            {
                errors && <HelperText type="error" visible >
                    {helperText}
                </HelperText>
            }

        </View>
    )
}
