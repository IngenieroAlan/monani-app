import { colors } from '@/utils/colors';
import React from 'react'
import { View } from 'react-native';
import { HelperText, HelperTextProps, TextInput, TextInputProps } from 'react-native-paper'

interface Props {
    label: string;
    formValue: string;
    field: string;
    helperText: string;
    helperType?: "error" | "info";
    placeholder?: string;
    onChange: (value: any, field: any) => void;
    validation?: () => boolean;
    more?: TextInputProps;
    //helperMore?: HelperTextProps;
}

export const CustomTextInput = ({ label, formValue, placeholder = "", field, helperText, helperType = "error", more, validation, onChange }: Props) => {
    return (
        <View>
            <TextInput
                label={label}
                value={formValue}
                textColor={colors.input.main}
                onChangeText={(value) => onChange(value, field)}
                placeholder={placeholder}
                placeholderTextColor={colors.input.placeHolder}
                mode="outlined"
                error={validation ? !validation() : formValue.trim() === ""}
                {...more}
            />
            <HelperText type={helperType} visible={validation ? !validation() : formValue.trim() === ""} >
                {helperText}
            </HelperText>
        </View>
    )
}
