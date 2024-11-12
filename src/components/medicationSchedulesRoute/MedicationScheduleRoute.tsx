import CattleMedicationForm from "@/components/forms/CattleMedicationForm";
import useMedications from '@/hooks/collections/useMedications';
import useMedicationSchedules from "@/hooks/collections/useMedicationSchedule";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { RootStackParamList } from "@/navigation/types";
import ACMedicationSchema, { ACMedication } from "@/validationSchemas/ACMedicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Appbar, Button, IconButton } from "react-native-paper";

export default function MedicationScheduleRoute({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'MedicationScheduleRoute'>) {
  const { cattleInfo } = useAppSelector(state => state.cattles)
  const { medicationSchedules } = useMedicationSchedules(cattleInfo!)
  const { medications } = useMedications()
  const dispatch = useAppDispatch();

  const medicationScheduleId = route.params?.medicationScheduleId;
  const modify = route.params?.modify || false;

  const medicationSchedule = useMemo(() => medicationSchedules?.find(medicationSchedule => medicationSchedule.id === medicationScheduleId), [medicationSchedules, medicationScheduleId])
  const medicationName = useMemo(() => (medications.find(medication => medication.id === medicationSchedule?.medication.id)?.name), [medications, medicationSchedule])

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
        medication: medicationSchedule.id,
        nextDoseAt: medicationSchedule.nextDoseAt,
        dosesPerYear: medicationSchedule.dosesPerYear
      })
  }, [medicationSchedule]);

  const onSubmit = useCallback(() => {
    const { medication, nextDoseAt, dosesPerYear } = getValues()

    // if (modify) {
    //   dispatch(modifyMedicationSchedule({
    //     medication,
    //     nextDoseAt,
    //     dosesPerYear,
    //     cattleId: cattle.tagId,
    //   }))
    // } else {
    //   dispatch(saveMedicationSchedule({
    //     medicationSchedule: {
    //       medicationScheduleId: Math.random().toString(),
    //       medication,
    //       nextDoseAt,
    //       dosesPerYear,
    //       cattleId: cattle.tagId,
    //     }
    //   }))
    //   reset();
    // }

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