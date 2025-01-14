import { ComponentProps, forwardRef, useCallback, useEffect, useState } from "react";
import { CustomTextInput } from "./CustomTextInput";
import { Control, Controller, FieldError, FieldPath, FieldValues } from "react-hook-form";
import { HelperText, IconButton, Text, TextInput, TextInputProps } from "react-native-paper";
import { View, ViewProps } from "react-native";
import useDateInput from "@/hooks/useDateInput";
import { DatePickerInputProps } from "react-native-paper-dates/lib/typescript/Date/DatePickerInput.shared";
import TextInputWithMask from "./TextInputWithMask";
import { DatePicker } from "./DatePicker";
import { DateType } from "react-native-ui-datepicker";
import { DatePickerSingleProps } from "react-native-ui-datepicker/lib/typescript/src/DateTimePicker";
import dayjs from "dayjs";

interface Props<T extends FieldValues> {
  label: string;
  control: Control<T>;
  more?: TextInputProps;
  name: FieldPath<T>;
  errors: FieldError | undefined;
  containerStyle?: ViewProps;
  inputMode: DatePickerInputProps['inputMode'];
  onValidationError?: ((error: string | null) => void) | undefined;
  withDateFormatInLabel?: boolean;
  placeholder?: string;
  moreDateTimePicker?: DatePickerSingleProps;
  minDate?: Date;
  maxDate?: Date;
}

const MDatePickerInput = <T extends FieldValues>(
  {
    control,
    name,
    errors,
    containerStyle,
    onValidationError,
    withDateFormatInLabel = true,
    inputMode,
    label,
    placeholder = "",
    more,
    moreDateTimePicker,
    minDate,
    maxDate
  }: Props<T>,
  ref?: any
) => {
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [dateType, setDateType] = useState<DateType | undefined>(dayjs())

  function getLabel({
    withDateFormatInLabel,
    inputFormat,
    label,
  }: {
    withDateFormatInLabel: boolean
    inputFormat: string
    label: string | undefined
  }) {
    if (withDateFormatInLabel) {
      return label ? `${label} (${inputFormat})` : inputFormat
    }
    return label || ''
  }

  // Transform DateType value into Date
  const transformDateType = useCallback((value: DateType) => {
    if (value) {
      return new Date(value.toLocaleString())
    }
    return undefined
  }, [])

  return (<>
    <View style={containerStyle}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const {
            formattedValue,
            inputFormat,
            onChangeText: onDateInputChangeText,
            error,
          } = useDateInput({
            locale: 'es',
            value: value,
            validRange: undefined,
            inputMode: inputMode,
            onChange: onChange,
            onValidationError: onValidationError,
          })

          useEffect(() => {
            if (formattedValue) {
              const stringValue = formattedValue.split('/').reverse().join('-')
              setDateType(dayjs(stringValue))
            }
          }, [formattedValue])

          return (<>
            <TextInputWithMask
              label={getLabel({
                label: label,
                inputFormat,
                withDateFormatInLabel,
              })}
              placeholder={placeholder}
              value={formattedValue}
              onChangeText={(e) => onDateInputChangeText(e)}
              onBlur={onBlur}
              keyboardType='numeric'
              mask={inputFormat}
              mode="outlined"
              inputButton={<TextInput.Icon
                icon="calendar"
                size={24}
                forceTextInputFocus={false}
                // disabled={more?.disabled}
                onPress={() => setOpenDatePicker(true)} />}
              {...more}
            />
            {/* <Text>{JSON.stringify(dateType)}</Text> */}
            <DatePicker
              locale="es"
              mode="single"
              date={dateType}
              visible={openDatePicker}
              onConfirm={() => {
                const date = transformDateType(dateType)
                onChange(date)
                setOpenDatePicker(false)
              }}
              onChange={(params) => {
                setDateType(dayjs(params.date))
              }}
              onDismiss={() => setOpenDatePicker(false)}
              onCancel={() => setOpenDatePicker(false)}
              dismissable
              firstDayOfWeek={1}
              minDate={minDate}
              maxDate={maxDate}
              {...moreDateTimePicker}
            />
          </>)
        }}
      />
      {
        errors && <HelperText type="error">
          {errors?.message ? errors.message : ''}
        </HelperText>
      }
    </View>
  </>)
}

export default MDatePickerInput;