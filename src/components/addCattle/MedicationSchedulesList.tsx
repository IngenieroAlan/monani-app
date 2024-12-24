import { useAppDispatch } from '@/hooks/useRedux'
import { ACMedicationSchedule } from '@/interfaces/cattleInterfaces'
import { deleteMedicationSchedule } from '@/redux/slices/addCattleSlice'
import { show } from '@/redux/slices/uiVisibilitySlice'
import { useNavigation } from '@react-navigation/native'
import { memo, useState } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { IconButton, List, Menu, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MedicationSchedulesSnackbarId } from '../layout/cattleDetails/Components/medicationSchedules/MedicationSchedulesSnackbarContainer'

const ListItemMenu = ({ medicationScheduleId }: { medicationScheduleId: string }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchorPosition='bottom'
      statusBarHeight={insets.top}
      anchor={
        <IconButton
          icon='dots-vertical'
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        title='Editar'
        leadingIcon='pencil-outline'
        onPress={() => {
          setMenuVisible(false)
          navigation.navigate('CreateCattleStack', {
            screen: 'Medication',
            params: {
              medicationScheduleId,
              modify: true
            }
          })
        }}
      />
      <Menu.Item
        theme={{ colors: { onSurface: theme.colors.onSurface } }}
        title='Eliminar'
        leadingIcon='minus'
        onPress={() => {
          setMenuVisible(false)
          dispatch(show(MedicationSchedulesSnackbarId.REMOVED_MEDICATION_SCHEDULE))
          dispatch(deleteMedicationSchedule({ medicationScheduleId: medicationScheduleId }))
        }}
      />
    </Menu>
  )
}

const ListItem = ({ medicationSchedule: medicationSchedule }: { medicationSchedule: ACMedicationSchedule }) => {
  return (
    <List.Item
      style={{ paddingVertical: 2, paddingRight: 8 }}
      title={medicationSchedule.medication.name}
      description={medicationSchedule.medication.medicationType}
      right={() => <ListItemMenu medicationScheduleId={medicationSchedule.medicationScheduleId} />}
    />
  )
}

const MedicationSchedulesList = ({ medicationSchedules }: { medicationSchedules: ACMedicationSchedule[] }) => {
  return (
    <FlatList
      data={medicationSchedules}
      renderItem={({ item }) => <ListItem medicationSchedule={item} />}
      keyExtractor={(item) => item.medicationScheduleId}
      ListFooterComponent={() => <View style={{ height: 88 }} />}
    />
  )
}

export default memo(MedicationSchedulesList)
