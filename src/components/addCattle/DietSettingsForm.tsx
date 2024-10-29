import { memo } from "react";
import { Control, Controller, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import { ACDietFields } from "@/validationSchemas/ACDietSchema";

const DietSettingsForm = (
  { control, formState }:
    {
      control: Control<ACDietFields>;
      formState: FormState<ACDietFields>;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: matterProportion } = useController({ name: 'matterProportion', control });
  const { field: matterAmount } = useController({ name: 'matterAmount', control });

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
            matterAmount.onChange(undefined);
          }
        }}
        theme={{
          colors: { background: theme.colors.elevation.level3 }
        }}
      />

      {matterProportion.value !== 'Sin definir' && (
        <CustomTextInput
          name='matterAmount'
          control={control}
          label='Cantidad de materia*'
          errors={errors.matterAmount}
          helperText={errors.matterAmount?.message ? errors.matterAmount?.message : ''}
          more={{
            theme: { colors: { background: theme.colors.elevation.level3 } },
            keyboardType: 'numeric',
          }}
        />
      )}

      <Controller
        control={control}
        name="isConcentrateExcluded"
        render={({ field: { onChange, value } }) => (
          <Checkbox.Item
            label="En cuarentena"
            status={value ? 'checked' : 'unchecked'}
            onPress={() => onChange(!value)}
          />
        )}
      />

    </View>
  )
}

export default memo(DietSettingsForm);