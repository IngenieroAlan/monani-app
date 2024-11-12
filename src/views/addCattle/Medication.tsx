import CattleMedicationForm from "@/components/forms/CattleMedicationForm";
import useMedications from '@/hooks/collections/useMedications';
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParamsList } from "@/navigation/types";
import { modifyMedicationSchedule, saveMedicationSchedule } from "@/redux/slices/addCattleSlice";
import ACMedicationSchema, { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function Medication({ navigation, route }: NativeStackScreenProps<AddCattleStackParamsList, 'Medication'>) {
  const { medicationSchedules, cattle } = useAppSelector(state => state.addCattle)
  const { medications } = useMedications()
  const dispatch = useAppDispatch();

  const medicationScheduleId = route.params?.medicationScheduleId || '';
  const modify = route.params?.modify || false;

  const medicationSchedule = useMemo(() => medicationSchedules.find(medicationSchedule => medicationSchedule.medicationScheduleId === medicationScheduleId), [medicationSchedules, medicationScheduleId])
  const currentMedication = useMemo(() => medications.find(medication => medication.id === medicationSchedule?.medication.id), [medications, medicationSchedule])
  const medicationName = useMemo(() => (currentMedication ? currentMedication.name : undefined), [currentMedication])

  const initialMedicationScheduleValues = medicationSchedule ? {
    medication: undefined,
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
    const medication = getValues('medication')
    const nextDoseAt = getValues('nextDoseAt')
    const dosesPerYear = getValues('dosesPerYear')

    try {
      if (modify) {
        dispatch(modifyMedicationSchedule({
          medicationSchedule: {
            medicationScheduleId: medicationScheduleId,
            medication: medication ? medication : currentMedication,
            nextDoseAt,
            dosesPerYear,
            cattleId: cattle.tagId,
          }
        }))
      } else {
        dispatch(saveMedicationSchedule({
          medicationSchedule: {
            medicationScheduleId: Math.random().toString(),
            medication: medication,
            nextDoseAt,
            dosesPerYear,
            cattleId: cattle.tagId,
          }
        }))
        reset();
      }
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show a snackbar with the error message
      return;
    }

    navigation.goBack()
  }, [])

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