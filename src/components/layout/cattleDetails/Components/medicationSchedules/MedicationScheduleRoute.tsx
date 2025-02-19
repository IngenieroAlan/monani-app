import CattleMedicationForm from "@/components/forms/CattleMedicationForm";
import useMedications from '@/hooks/collections/useMedications';
import useMedicationSchedules from "@/hooks/collections/useMedicationSchedule";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { CattleStackParamList } from "@/navigation/types";
import { show } from "@/redux/slices/uiVisibilitySlice";
import ACMedicationSchema, { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";
import { MedicationSchedulesSnackbarId } from "./MedicationSchedulesSnackbarContainer";

type ScreenProps = NativeStackScreenProps<CattleStackParamList, 'MedicationScheduleRoute'>

export default function MedicationScheduleRoute({ navigation, route }: ScreenProps) {
  const { cattleInfo } = useAppSelector(state => state.cattles)
  const { medicationSchedules } = useMedicationSchedules(cattleInfo!)
  const { medicationsRecords } = useMedications()
  const dispatch = useAppDispatch();

  const medicationScheduleId = route.params?.medicationScheduleId;
  const modify = route.params?.modify || false;

  const medicationSchedule = useMemo(() => medicationSchedules?.find(medicationSchedule => medicationSchedule.id === medicationScheduleId), [medicationSchedules, medicationScheduleId])
  const currentMedication = useMemo(() => medicationsRecords.find(medication => medication.id === medicationSchedule?.medication.id), [medicationSchedule, medicationsRecords])
  const medicationName = useMemo(() => (currentMedication ? currentMedication.name : undefined), [currentMedication])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<ACMedication>({
    defaultValues: {
      medication: undefined,
      nextDoseAt: undefined,
      dosesPerYear: undefined
    },
    resolver: zodResolver(ACMedicationSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  useEffect(() => {
    if (medicationSchedule)
      reset({
        medication: medicationSchedule.medication.id,
        nextDoseAt: medicationSchedule.nextDoseAt,
        dosesPerYear: medicationSchedule.dosesPerYear
      })
  }, [medicationSchedule]);

  const onSubmit = useCallback(() => {
    const { medication, nextDoseAt, dosesPerYear } = getValues()
    const findedMed = medication ? medicationsRecords.find(FMedication => FMedication.id === medication) : undefined

    const Action = async () => {
      try {
        if (modify) {
          await medicationSchedule?.updateMedicationSchedule({
            medication: findedMed ? findedMed : currentMedication!,
            nextDoseAt,
            dosesPerYear,
          });
          dispatch(show(MedicationSchedulesSnackbarId.UPDATED_MEDICATION_SCHEDULE))
        } else {
          await cattleInfo?.addMedicationSchedule({
            medication: findedMed!,
            nextDoseAt,
            dosesPerYear,
          });
          reset();
          dispatch(show(MedicationSchedulesSnackbarId.STORED_MEDICATION_SCHEDULE))
        }
      } catch (error) {
        console.error("Failed to update diet feed:", error);
        dispatch(show(MedicationSchedulesSnackbarId.SAME_MEDICATION))
        return;
      }
    };

    Action();
    navigation.goBack()
  }, [medicationSchedule, currentMedication, medicationsRecords]);

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title={modify ? 'Ajustar medicación' : 'Agregar medicación'} />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <CattleMedicationForm
      control={control}
      formState={formState}
      medicationName={medicationName}
    />
  </>)
}