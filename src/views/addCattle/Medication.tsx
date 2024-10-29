import MedicationForm from "@/components/addCattle/MedicationForm";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AddCattleStackParams } from "@/navigation/stacks/AddCattleStack";
import { modifyMedicationSchedule, saveMedicationSchedule } from "@/redux/slices/addCattleSlice";
import { RootState } from "@/redux/store/store";
import ACMedicationSchema, { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function Medication({ navigation, route }: NativeStackScreenProps<AddCattleStackParams, 'Medication'>) {
  const { medicationSchedules, cattle } = useAppSelector(state => state.addCattle)
  const medications = useAppSelector((state: RootState) => state.medications.records)
  const dispatch = useAppDispatch();

  const medicationScheduleId = route.params?.medicationScheduleId || '';
  const modify = route.params?.modify || false;

  const medicationSchedule = useMemo(() => medicationSchedules.find(medicationSchedule => medicationSchedule.medicationScheduleId === medicationScheduleId), [medicationSchedules, medicationScheduleId])
  const initialMedicationScheduleValues = medicationSchedule ? {
    medicationId: medicationSchedule.medicationId,
    nextDoseAt: medicationSchedule.nextDoseAt,
    dosesPerYear: medicationSchedule.dosesPerYear
  } : undefined
  const medicationName = useMemo(() => (medications.find(medication => medication.id === medicationSchedule?.medicationId)?.name), [medications, medicationSchedule])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState
  } = useForm<ACMedication>({
    defaultValues: initialMedicationScheduleValues || {
      medicationId: undefined,
      nextDoseAt: undefined,
      dosesPerYear: undefined
    },
    resolver: zodResolver(ACMedicationSchema),
    mode: 'onTouched'
  })
  const { isSubmitting, isValid, errors, isDirty } = formState

  const onSubmit = useCallback(() => {
    const medicationId = getValues('medicationId')
    const nextDoseAt = getValues('nextDoseAt')
    const dosesPerYear = getValues('dosesPerYear')

    if (modify) {
      dispatch(modifyMedicationSchedule({
        medicationSchedule: {
          medicationScheduleId: medicationScheduleId,
          medicationId,
          nextDoseAt,
          dosesPerYear,
          cattleId: cattle.cattleId,
        }
      }))
    } else {
      dispatch(saveMedicationSchedule({
        medicationSchedule: {
          medicationScheduleId: Math.random().toString(),
          medicationId,
          nextDoseAt,
          dosesPerYear,
          cattleId: cattle.cattleId,
        }
      }))
      reset();
    }

    navigation.goBack()
  }, [])

  return (<>
    <Appbar.Header>
      <IconButton icon={'close'} onPress={navigation.goBack} />
      <Appbar.Content title={modify ? 'Ajustar medicación' : 'Agregar medicación'} />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty || isSubmitting}>Guardar</Button>
    </Appbar.Header>
    <MedicationForm
      control={control}
      formState={formState}
      medicationName={medicationName}
    />
  </>)
}