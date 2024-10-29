import MedicationSchedulesList from "@/components/addCattle/MedicationSchedulesList"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { RootStackParams } from "@/navigation/Navigator"
import { reset } from "@/redux/slices/addCattleSlice"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AddCattleStackParams } from "../../navigation/stacks/AddCattleStack"
import { RootState } from "@/redux/store/store"
import useMedications from "@/hooks/collections/useMedications"
import { MedicationScheduleItem } from "@/interfaces/cattleInterfaces"
import { useEffect, useState } from "react"
import { setMedications } from "@/redux/slices/medicationsSlice"

export type MedicationSchedulesNavigationProps = NativeStackScreenProps<AddCattleStackParams & RootStackParams, 'Medications'>;
export const Medications = ({ navigation }: MedicationSchedulesNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const medications = useAppSelector((state: RootState) => state.medications.records)
  const { getMedications } = useMedications()
  const { medicationSchedules } = useAppSelector((state: RootState) => state.addCattle)
  const [currentMedicationSchedules, setCurrentMedicationSchedules] = useState<MedicationScheduleItem[]>([])

  useEffect(() => {
    const fetchMedications = async () => {
      dispatch(setMedications(await getMedications()))
    }

    if (medications.length === 0) fetchMedications()
  }, [medications])

  useEffect(() => {    
    setCurrentMedicationSchedules(
      medicationSchedules.map(medicationSchedule => {
        const medication = medications.find(medication => medication.id === medicationSchedule.medicationId)
        return {
          ...medicationSchedule,
          medicationType: medication?.medicationType || 'Otro',
          medicationName: medication?.name || '', 
        }
      })
    )
  }, [medicationSchedules])

  // TODO: Fetch medications from db

  const goBack = () => {
    dispatch(reset())
    navigation.navigate('HomeView')
  }

  const handleSave = () => {
    // TODO: Save cattle to db

    navigation.navigate('HomeView');
  }

  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title='Medicación' />
      <Appbar.Action icon="plus" onPress={() => navigation.navigate('Medication')} />
    </Appbar.Header>
    <SafeAreaProvider style={{ backgroundColor: theme.colors.surface }}>
      <MedicationSchedulesList
        navigation={navigation}
        medicationSchedules={currentMedicationSchedules}
      />
      <View style={styles.navigationButtons}>
        <Button
          icon="arrow-left"
          mode="elevated"
          onPress={() => navigation.goBack()}
        >
          Atras
        </Button>
        <Button
          icon="content-save-outline"
          mode="elevated"
          onPress={handleSave}
        >
          Guardar
        </Button>
      </View>
    </SafeAreaProvider>
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  navigationButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 10,
    padding: 16
  }
});
