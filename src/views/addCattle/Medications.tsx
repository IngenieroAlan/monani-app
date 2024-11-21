import MedicationSchedulesList from "@/components/addCattle/MedicationSchedulesList"
import DismissDialog from "@/components/DismissDialog"
import { HomeSnackbarId } from '@/components/home/HomeSnackbarContainer'
import MedicationSchedulesSnackbarContainer from "@/components/layout/cattleDetails/Components/medicationSchedules/MedicationSchedulesSnackbarContainer"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { AddCattleStackParamsList, RootStackParamList } from "@/navigation/types"
import { reset } from "@/redux/slices/addCattleSlice"
import { setCattleInfo } from "@/redux/slices/cattles"
import { show } from "@/redux/slices/uiVisibilitySlice"
import { RootState } from "@/redux/store/store"
import { createCattle } from "@/utils"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StyleSheet, View } from "react-native"
import { Appbar, Button, useTheme } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

export type MedicationSchedulesNavigationProps = NativeStackScreenProps<AddCattleStackParamsList & RootStackParamList, 'Medications'>;
const DISMISS_DIALOG_ID = 'createCattleDismissDialog'

export const Medications = ({ navigation }: MedicationSchedulesNavigationProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { cattle, diet, dietFeeds, medicationSchedules } = useAppSelector((state: RootState) => state.addCattle)

  const goBack = () => {
    dispatch(reset())
    navigation.navigate('BottomTabsStack', { screen: 'Ganado' })
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
          ).then(createdCattle => {
            dispatch(setCattleInfo(createdCattle))
            navigation.navigate('CattleDetailsLayout', {
              screen: 'InfoRoute'
            })
          })
        }
      } catch (error) {
        console.error(error);
      }
    };

    createCattleFunction();
    dispatch(reset());
    navigation.navigate('BottomTabsStack', { screen: 'Ganado' });
  }

  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => dispatch(show(DISMISS_DIALOG_ID))} />
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
      <DismissDialog
        id={DISMISS_DIALOG_ID}
        dismissSnackbarId={HomeSnackbarId.CREATE_CATTLE_DISMISS}
        onConfirm={goBack}
        onCancel={() => { }}
      />
      <MedicationSchedulesSnackbarContainer />
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
