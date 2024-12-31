import { SurfaceContainer } from '@/components/SurfaceContainer'
import { MedicationProvider } from '@/contexts'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { show } from '@/redux/slices/uiVisibilitySlice'
import CreateMedicationDialog, {
  CREATE_MEDICATION_DIALOG_ID
} from '@/views/medications/components/CreateMedicationDialog'
import DeleteMedicationDialog from '@/views/medications/components/DeleteMedicationDialog'
import EditMedicationDialog from '@/views/medications/components/EditMedicationDialog'
import MedicationsSnackbarContainer from '@/views/medications/components/MedicationsSnackbarContainer'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { AnimatedFAB, Appbar } from 'react-native-paper'
import { MedicationsList } from './components/MedicationsList/MedicationsList'

const List = () => {
  const dispatch = useAppDispatch()
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <>
      <MedicationsList flashListProps={{ onScroll }} />
      <AnimatedFAB
        style={styles.animatedFab}
        icon='plus'
        label='Añadir'
        extended={isFabExtended}
        onPress={() => dispatch(show(CREATE_MEDICATION_DIALOG_ID))}
      />
    </>
  )
}

const MedicationsView = () => {
  const navigation = useNavigation()

  return (
    <>
      <MedicationProvider>
        <SurfaceContainer>
          <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title='Medicamentos' />
          </Appbar.Header>
          <List />
          <EditMedicationDialog />
          <DeleteMedicationDialog />
        </SurfaceContainer>
      </MedicationProvider>
      <CreateMedicationDialog />
      <MedicationsSnackbarContainer />
    </>
  )
}

const styles = StyleSheet.create({
  animatedFab: {
    bottom: 16,
    right: 16
  }
})

export default MedicationsView
