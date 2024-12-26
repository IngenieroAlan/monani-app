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
import MedicationsList from '@/views/medications/components/MedicationsList'
import MedicationsSnackbarContainer from '@/views/medications/components/MedicationsSnackbarContainer'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { AnimatedFAB, Appbar } from 'react-native-paper'

const MedicationsView = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <>
      <MedicationProvider>
        <SurfaceContainer>
          <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title='Medicamentos' />
          </Appbar.Header>
          <MedicationsList onScroll={onScroll} />
          <AnimatedFAB
            style={styles.animatedFab}
            icon='plus'
            label='Añadir'
            extended={isFabExtended}
            onPress={() => dispatch(show(CREATE_MEDICATION_DIALOG_ID))}
          />
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
