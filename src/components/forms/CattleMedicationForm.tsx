import useMedications from "@/hooks/collections/useMedications";
import { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { memo, useMemo } from "react";
import { Control, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDatePickerInput from "../MDatePickerInput";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";


const CattleMedicationForm = ({ control, formState, medicationName }: {
  control: Control<ACMedication>;
  formState: FormState<ACMedication>;
  medicationName?: string;
}
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: dosesPerYear } = useController({ name: 'dosesPerYear', control });
  const { medications } = useMedications()

  const medicationData: SearchBarDataItem[] =
    useMemo(() =>
      medications.map(medication => ({
        id: medication.id,
        title: medication.name,
        description: medication.medicationType,
        value: medication.id
      }))
      , [medications])

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 16,
      gap: 16,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <MSearchBar
        name='medication'
        control={control}
        placeholder="Medicación"
        initialQuery={medicationName}
        mode="bar"
        theme={{ roundness: 1 }}
        data={medicationData}
        erroMessage={errors.medication?.message ? String(errors.medication.message) : undefined}
        maxHeight={500}
        style={{ backgroundColor: theme.colors.surface, borderWidth: 1 }}
      />
      <MDatePickerInput
        label="Fecha de próxima dosis*"
        inputMode="start"
        control={control}
        name="nextDoseAt"
        errors={errors.nextDoseAt}
        minDate={new Date()}
      />
      <CustomTextInput
        name='dosesPerYear'
        control={control}
        label='Dosis por año*'
        errors={errors.dosesPerYear}
        helperText={errors.dosesPerYear?.message ? errors.dosesPerYear?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.surface } },
          keyboardType: 'numeric',
          value: dosesPerYear.value ? String(dosesPerYear.value) : '',
          onChangeText: (value: string) => dosesPerYear.onChange(parseFloat(value)),
        }}
      />
    </View>
  )
}

export default memo(CattleMedicationForm);