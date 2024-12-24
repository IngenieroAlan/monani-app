import CattleMedicationForm from "@/components/forms/CattleMedicationForm";
import MedicationSchedulesSnackbarContainer, { MedicationSchedulesSnackbarId } from "@/components/layout/cattleDetails/Components/medicationSchedules/MedicationSchedulesSnackbarContainer";
import useMedications from '@/hooks/collections/useMedications';
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { CreateCattleStackParamList } from "@/navigation/types";
import { modifyMedicationSchedule, saveMedicationSchedule } from "@/redux/slices/addCattleSlice";
import { show } from "@/redux/slices/uiVisibilitySlice";
import ACMedicationSchema, { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

type ScreenProps = NativeStackScreenProps<CreateCattleStackParamList, 'Medication'>

export default function Medication({ navigation, route }: ScreenProps) {
  const { medicationSchedules, cattle } = useAppSelector(state => state.addCattle)
  const { medications } = useMedications()
  const dispatch = useAppDispatch();

  const medicationScheduleId = route.params?.medicationScheduleId || '';
  const modify = route.params?.modify || false;

  const medicationSchedule = useMemo(() => medicationSchedules.find(medicationSchedule => medicationSchedule.medicationScheduleId === medicationScheduleId), [medicationSchedules, medicationScheduleId])
  const currentMedication = useMemo(() => medications.find(medication => medication.id === medicationSchedule?.medication.id), [medications, medicationSchedule])
  const medicationName = useMemo(() => (currentMedication ? currentMedication.name : undefined), [currentMedication])

  const initialMedicationScheduleValues = medicationSchedule ? {
    medication: medicationSchedule.medication.id,
    nextDoseAt: medicationSchedule.nextDoseAt,
    dosesPerYear: medicationSchedule.dosesPerYear
  } : undefined

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<ACMedication>({
    defaultValues: initialMedicationScheduleValues || {
      medication: undefined,
      nextDoseAt: undefined,
      dosesPerYear: undefined
    },
    resolver: zodResolver(ACMedicationSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const { medication, nextDoseAt, dosesPerYear } = getValues()
    const findedMed = medication ? medications.find(FMedication => FMedication.id === medication) : undefined

    try {
      if (modify) {
        dispatch(modifyMedicationSchedule({
          medicationSchedule: {
            medicationScheduleId: medicationScheduleId,
            medication: findedMed ? findedMed : currentMedication!,
            nextDoseAt,
            dosesPerYear,
            cattleId: cattle.tagId,
          }
        }))
        dispatch(show(MedicationSchedulesSnackbarId.UPDATED_MEDICATION_SCHEDULE))
      } else {
        dispatch(saveMedicationSchedule({
          medicationSchedule: {
            medicationScheduleId: Math.random().toString(),
            medication: findedMed!,
            nextDoseAt,
            dosesPerYear,
            cattleId: cattle.tagId,
          }
        }))
        reset();
        dispatch(show(MedicationSchedulesSnackbarId.STORED_MEDICATION_SCHEDULE))
      }
    } catch (error) {
      console.error(error);
      dispatch(show(MedicationSchedulesSnackbarId.SAME_MEDICATION))
      return;
    }

    navigation.goBack()
  }, [currentMedication, medicationScheduleId, cattle.tagId, medications])

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
    <MedicationSchedulesSnackbarContainer />
  </>)
}