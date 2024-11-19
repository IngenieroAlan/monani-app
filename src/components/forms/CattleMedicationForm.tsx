import useMedications from "@/hooks/collections/useMedications";
import { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { memo, useMemo } from "react";
import { Control, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { CustomTextInput } from "../CustomTextInput";
import MDatePickerInput from "../MDatePickerInput";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";
import dayjs from "dayjs";


const CattleMedicationForm = ({ control, formState, medicationName }: {
  control: Control<ACMedication>;
  formState: FormState<ACMedication>;
  medicationName?: string;
}
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: dosesPerYear } = useController({ name: 'dosesPerYear', control });
  const { field: nextDoseAt } = useController({ name: 'nextDoseAt', control });
  const { medications } = useMedications()

  const medicationData: SearchBarDataItem[] =
    useMemo(() =>
      medications.map(medication => ({
        id: medication.id,
        title: medication.name,
        description: medication.medicationType,
        value: medication.id
      })), [medications])

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
      />
      <MDatePickerInput
        label="Fecha de próxima dosis*"
        inputMode="start"
        control={control}
        name="nextDoseAt"
        errors={errors.nextDoseAt}
        minDate={new Date()}
        more={{
          theme: { colors: { background: theme.colors.elevation.level1 } }
        }}
      // moreDateTimePicker={{
      //   mode: 'single',
      //   // if there is no current value then current date+1 day
      //   date: nextDoseAt.value ? dayjs(nextDoseAt.value).toDate() : dayjs(new Date().setDate(new Date().getDate() + 1)),
      // }}
      />
      <CustomTextInput
        name='dosesPerYear'
        control={control}
        label='Dosis por año*'
        errors={errors.dosesPerYear}
        helperText={errors.dosesPerYear?.message ? errors.dosesPerYear?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.elevation.level1 } },
          keyboardType: 'numeric',
          value: dosesPerYear.value ? String(dosesPerYear.value) : '',
          onChangeText: (value: string) => dosesPerYear.onChange(parseFloat(value)),
        }}
      />
    </View>
  )
}

export default memo(CattleMedicationForm);