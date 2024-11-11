import useMedications from "@/hooks/collections/useMedications";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setMedications } from "@/redux/slices/medicationsSlice";
import { RootState } from "@/redux/store/store";
import { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { memo, useEffect, useMemo } from "react";
import { Control, Controller, FormState, useController } from "react-hook-form";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CustomTextInput } from "../CustomTextInput";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";
import MDatePickerInput from "../MDatePickerInput";


const CattleMedicationForm = ({ control, formState, medicationName }: {
  control: Control<ACMedication>;
  formState: FormState<ACMedication>;
  medicationName?: string;
}
) => {
  const theme = useTheme();
  const { errors } = formState;
  const { field: dosesPerYear } = useController({ name: 'dosesPerYear', control });

  const medications = useAppSelector((state: RootState) => state.medications.records)
  const { getMedications } = useMedications()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchMedications = async () => {
      dispatch(setMedications(await getMedications()))
    }

    if (medications.length === 0) fetchMedications()
  }, [medications])

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
        name='medicationId'
        control={control}
        placeholder="Medicación"
        initialQuery={medicationName}
        mode="bar"
        theme={{ roundness: 1 }}
        data={medicationData}
        errroMessage={errors.medicationId?.message ? errors.medicationId?.message : ''}
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