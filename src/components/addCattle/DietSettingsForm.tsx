import { memo } from "react";
import { Control, Controller, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { Checkbox, Text, useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import { ACDietFields } from "@/validationSchemas/ACDietSchema";

const DietSettingsForm = (
  { control, formState, cattleWeight }:
    {
      control: Control<ACDietFields>;
      formState: FormState<ACDietFields>;
      cattleWeight: number;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: matterProportion } = useController({ name: 'matterProportion', control });
  const { field: quantity } = useController({ name: 'quantity', control });

  const dropdownOptions = [
    {
      label: 'Porcentaje de peso',
      value: 'Porcentaje de peso'
    },
    {
      label: 'Fija',
      value: 'Fija'
    },
    {
      label: 'Sin definir',
      value: 'Sin definir'
    }
  ]

  return (
    <View style={{ padding: 16, gap: 10, flex: 1 }}>
      <CustomTextInput
        name='waterAmount'
        control={control}
        label='Cantidad de agua*'
        errors={errors.waterAmount}
        helperText={errors.waterAmount?.message ? errors.waterAmount?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.elevation.level3 } },
          keyboardType: 'numeric'
        }}
      />
      <MDropdown
        name='matterProportion'
        control={control}
        label='Proporción de materia*'
        options={dropdownOptions}
        error={errors.matterProportion !== undefined}
        errroMessage={errors.matterProportion?.message}
        onSelect={() => {
          if (matterProportion.value === 'Sin definir') {
            quantity.onChange(undefined);
          }
        }}
        theme={{
          colors: { background: theme.colors.elevation.level3 }
        }}
      />

      <CustomTextInput
        name='quantity'
        control={control}
        label='Cantidad de materia*'
        errors={errors.quantity}
        helperText={errors.quantity?.message ? errors.quantity?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.elevation.level3 } },
          keyboardType: 'numeric',
          disabled: matterProportion.value === 'Sin definir'
        }}
      />
      <Text variant="labelSmall">
        {matterProportion.value === 'Porcentaje de peso' ?
          `Equivalente a ${(cattleWeight * ((quantity.value ?? 0) / 100))} kg.` : ''}
      </Text>

      <Controller
        control={control}
        name="isConcentrateExcluded"
        render={({ field: { onChange, value } }) => (
          <Checkbox.Item
            label="Excluir concentrado de la proporción de materia"
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
          />
        )}
      />

    </View>
  )
}

export default memo(DietSettingsForm);