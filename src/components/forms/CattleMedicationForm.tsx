import DietFeedSchema from "@/validationSchemas/DietFeedSchema";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Control, Controller, FormState } from "react-hook-form";
import { FlatList, View } from "react-native";
import { HelperText, Searchbar, useTheme } from "react-native-paper";
import { z } from "zod";
import { CustomTextInput } from "../CustomTextInput";
import MDropdown from "../MDropdown";
import SearchFeedList from "../addCattle/SearchFeedList";
import MSearchBar, { SearchBarDataItem } from "../MSearchBar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import useFeeds from "@/hooks/collections/useFeeds";
import { setFeeds } from "@/redux/slices/feedsSlice";
import { RootState } from "@/redux/store/store";
import { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { DatePickerInput } from "react-native-paper-dates";
import useMedications from "@/hooks/collections/useMedications";
import { setMedications } from "@/redux/slices/medicationsSlice";


const CattleMedicationForm = (
  { control, formState, medicationName }:
    {
      control: Control<ACMedication>;
      formState: FormState<ACMedication>;
      medicationName?: string;
    }
) => {
  const theme = useTheme();
  const { errors } = formState;

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
      <View style={{
        flexDirection: 'row',
      }}>
        <Controller
          name="nextDoseAt"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <DatePickerInput
                locale="es"
                label="Fecha de próxima dosis"
                value={value}
                onChange={(d) => onChange(d)}
                inputMode="start"
                mode="outlined"
                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start' }}
              />
            )
          }}
        />
      </View>

      <CustomTextInput
        name='dosesPerYear'
        control={control}
        label='Dosis por año*'
        errors={errors.dosesPerYear}
        helperText={errors.dosesPerYear?.message ? errors.dosesPerYear?.message : ''}
        more={{
          theme: { colors: { background: theme.colors.surface } },
          keyboardType: 'numeric',
        }}
      />
    </View>
  )
}

export default memo(CattleMedicationForm);