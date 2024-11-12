import MedicationSchedulesList from "@/components/addCattle/MedicationSchedulesList"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { AddCattleStackParamsList, BottomTabsParamList } from "@/navigation/types"
import { reset } from "@/redux/slices/addCattleSlice"
import { RootState } from "@/redux/store/store"
import { createCattle } from "@/utils"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

export type MedicationSchedulesNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & BottomTabsParamList, 'Medications'>;
export const Medications = ({ navigation }: MedicationSchedulesNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { cattle, diet, dietFeeds, medicationSchedules } = useAppSelector((state: RootState) => state.addCattle)

  const goBack = () => {
    dispatch(reset())
    navigation.navigate('Ganado')
  }

  const handleSave = () => {
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
              waterAmount: diet.waterAmount
            },
            dietFeeds,
            medicationSchedules
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
        medicationSchedules={medicationSchedules}
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
