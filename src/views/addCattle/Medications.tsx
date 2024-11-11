import MedicationSchedulesList from "@/components/addCattle/MedicationSchedulesList"
import useMedications from "@/hooks/collections/useMedications"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { ACMedicationScheduleItem } from "@/interfaces/cattleInterfaces"
import { AddCattleStackParamsList, BottomTabsParamList } from "@/navigation/types"
import { reset } from "@/redux/slices/addCattleSlice"
import { setMedications } from "@/redux/slices/medicationsSlice"
import { RootState } from "@/redux/store/store"
import { createCattle } from "@/utils"
import { DietFeedFields } from "@/utils/createCattle"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

export type MedicationSchedulesNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList, 'Medications'>;
export const Medications = ({ navigation }: MedicationSchedulesNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const medications = useAppSelector((state: RootState) => state.medications.records)
  const { getMedications } = useMedications()
  const { cattle, diet, dietFeeds, medicationSchedules } = useAppSelector((state: RootState) => state.addCattle)
  const [currentMedicationSchedules, setCurrentMedicationSchedules] = useState<ACMedicationScheduleItem[]>([])

  const feeds = useAppSelector((state: RootState) => state.feeds.records)

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


  const goBack = () => {
    dispatch(reset())
    navigation.navigate('Ganado')
  }

  const handleSave = () => {
    const dietFeedsFields: DietFeedFields[] = dietFeeds.map(dietFeed => {
      const feed = feeds.find(feed => feed.id === dietFeed.feed.id)
      return {
        feed: feed!,
        feedAmount: dietFeed.feedAmount,
        feedProportion: dietFeed.feedProportion
      }
    })

    const medicationSchedulesFields = medicationSchedules.map(medicationSchedule => {
      const medication = medications.find(medication => medication.id === medicationSchedule.medicationId)
      return {
        medication: medication!,
        nextDoseAt: medicationSchedule.nextDoseAt,
        dosesPerYear: medicationSchedule.dosesPerYear
      }
    })

    const createCattleFunction = async () => {
      try {
        if (cattle.admittedAt && cattle.bornAt && diet.waterAmount) {
          await createCattle(
            {
              ...cattle,
              admittedAt: cattle.admittedAt,
              bornAt: cattle.bornAt
            },
            {
              ...diet,
              waterAmount: diet.waterAmount ?? 0 // Ensure waterAmount is a number
            },
            dietFeedsFields,
            medicationSchedulesFields
          )
        }
      } catch (error) {
        console.error(error);
      }
    };

    createCattleFunction();

    dispatch(reset());

    navigation.navigate('Ganado');
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
