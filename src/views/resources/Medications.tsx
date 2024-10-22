import CreateMedicationDialog, {
  CREATE_MEDICATION_DIALOG_ID
} from '@/components/resources/medications/CreateMedicationDialog'
import DeleteMedicationDialog from '@/components/resources/medications/DeleteMedicationDialog'
import MedicationsList from '@/components/resources/medications/MedicationsList'
import MedicationsSnackbarContainer from '@/components/resources/medications/MedicationsSnackbarContainer'
import { useAppDispatch } from '@/hooks/useRedux'
import useScrollFab from '@/hooks/useScrollFab'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { AnimatedFAB, Appbar, useTheme } from 'react-native-paper'

const Medications = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const flatListRef = useRef<FlatList>(null)
  const { onScroll, isFabExtended } = useScrollFab()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title='Medicamentos' />
      </Appbar.Header>
      <MedicationsList
        ref={flatListRef}
        onScroll={onScroll}
      />
      <AnimatedFAB
        style={styles.animatedFab}
        icon='plus'
        label='Añadir'
        extended={isFabExtended}
        onPress={() => dispatch(show(CREATE_MEDICATION_DIALOG_ID))}
      />

      <CreateMedicationDialog />
      <DeleteMedicationDialog />

      <MedicationsSnackbarContainer />
    </View>
  )
}

const styles = StyleSheet.create({
  animatedFab: {
    bottom: 16,
    right: 16
  }
})

export default Medications
